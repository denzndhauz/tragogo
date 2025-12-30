import { eq } from 'drizzle-orm'
import { db } from '~/server/database/client'
import { markedLocations, familyMembers, familyGroups } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/authMiddleware'
import type { CreateMarkedLocationRequest } from '~/types'

export default defineEventHandler(async (event) => {
    try {
        const user = await requireAuth(event)
        const body = await readBody<CreateMarkedLocationRequest>(event)

        if (!body.name || !body.latitude || !body.longitude) {
            throw createError({
                statusCode: 400,
                message: 'Name, latitude, and longitude are required',
            })
        }

        // Get user's family group, or create one if it doesn't exist
        let membership = await db.query.familyMembers.findFirst({
            where: eq(familyMembers.userId, user.id),
        })

        let groupId = membership?.groupId

        // If user is not in a family group, create a personal group for them
        if (!groupId) {
            const [newGroup] = await db.insert(familyGroups).values({
                name: `${user.name}'s Family`,
                createdBy: user.id,
            }).returning()

            // Add user as admin to the new group
            await db.insert(familyMembers).values({
                groupId: newGroup.id,
                userId: user.id,
                role: 'admin',
            })

            groupId = newGroup.id
        }

        // Create marked location
        const [location] = await db.insert(markedLocations).values({
            groupId: groupId,
            name: body.name,
            type: body.type || 'other',
            latitude: body.latitude.toString(),
            longitude: body.longitude.toString(),
            radius: body.radius || 100,
            notifyOnArrival: body.notifyOnArrival ?? true,
            createdBy: user.id,
        }).returning()

        return {
            success: true,
            location,
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Create marked location error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to create marked location',
        })
    }
})
