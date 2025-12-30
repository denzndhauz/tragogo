import { eq } from 'drizzle-orm'
import { db } from '~/server/database/client'
import { smartTags } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/authMiddleware'

export default defineEventHandler(async (event) => {
    try {
        const user = await requireAuth(event)

        // Get user's smart tags
        const tags = await db.query.smartTags.findMany({
            where: eq(smartTags.userId, user.id),
        })

        return { tags }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Get smart tags error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to get smart tags',
        })
    }
})
