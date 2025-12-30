import { eq, inArray } from 'drizzle-orm'
import { db } from '~/server/database/client'
import { markedLocations, familyMembers } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/authMiddleware'

export default defineEventHandler(async (event) => {
    try {
        const user = await requireAuth(event)

        // Get user's family groups
        const memberships = await db.query.familyMembers.findMany({
            where: eq(familyMembers.userId, user.id),
        })

        if (memberships.length === 0) {
            return { locations: [] }
        }

        const groupIds = memberships.map(m => m.groupId)

        // Get all marked locations for user's groups
        const locations = await db.query.markedLocations.findMany({
            where: inArray(markedLocations.groupId, groupIds),
        })

        return { locations }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Get marked locations error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to get marked locations',
        })
    }
})
