import { eq } from 'drizzle-orm'
import { db, pool } from '~/server/database/client'
import { locations, familyMembers } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/authMiddleware'
import type { LocationUpdateRequest } from '~/types'

export default defineEventHandler(async (event) => {
    try {
        const user = await requireAuth(event)
        const body = await readBody<LocationUpdateRequest>(event)

        if (!body.latitude || !body.longitude) {
            throw createError({
                statusCode: 400,
                message: 'Latitude and longitude are required',
            })
        }

        // Validate coordinates
        if (body.latitude < -90 || body.latitude > 90) {
            throw createError({
                statusCode: 400,
                message: 'Invalid latitude',
            })
        }

        if (body.longitude < -180 || body.longitude > 180) {
            throw createError({
                statusCode: 400,
                message: 'Invalid longitude',
            })
        }

        // Insert location
        const [location] = await db.insert(locations).values({
            userId: user.id,
            latitude: body.latitude.toString(),
            longitude: body.longitude.toString(),
            accuracy: body.accuracy?.toString(),
        }).returning()

        // Notify via PostgreSQL NOTIFY for real-time updates
        try {
            await pool.query(
                "SELECT pg_notify('location_update', $1)",
                [JSON.stringify({
                    userId: user.id,
                    latitude: body.latitude,
                    longitude: body.longitude,
                    accuracy: body.accuracy,
                    timestamp: location.timestamp,
                })]
            )
        } catch (notifyError) {
            console.error('Failed to send NOTIFY:', notifyError)
            // Don't fail the request if NOTIFY fails
        }

        return {
            success: true,
            location,
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Location update error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to update location',
        })
    }
})
