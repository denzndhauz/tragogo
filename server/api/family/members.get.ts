import { eq } from 'drizzle-orm'
import { db } from '~/server/database/client'
import { familyMembers, users, locations } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/authMiddleware'

export default defineEventHandler(async (event) => {
    try {
        const user = await requireAuth(event)

        // Get user's family memberships
        const memberships = await db.query.familyMembers.findMany({
            where: eq(familyMembers.userId, user.id),
            with: {
                group: true,
            },
        })

        if (memberships.length === 0) {
            return {
                members: [],
                groups: [],
            }
        }

        // Get all members from user's groups
        const groupIds = memberships.map(m => m.groupId)

        const allMembers = await db.query.familyMembers.findMany({
            where: (members, { inArray }) => inArray(members.groupId, groupIds),
            with: {
                user: {
                    columns: {
                        id: true,
                        email: true,
                        name: true,
                        profileIcon: true,
                        createdAt: true,
                    },
                },
                group: true,
            },
        })

        // Get latest location for each member
        const membersWithLocations = await Promise.all(
            allMembers.map(async (member) => {
                const latestLocation = await db.query.locations.findFirst({
                    where: eq(locations.userId, member.userId),
                    orderBy: (locs, { desc }) => [desc(locs.timestamp)],
                })

                return {
                    ...member,
                    latestLocation,
                }
            })
        )

        return {
            members: membersWithLocations,
            groups: memberships.map(m => m.group),
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Get family members error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to get family members',
        })
    }
})
