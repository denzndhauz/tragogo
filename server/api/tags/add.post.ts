import { eq } from 'drizzle-orm'
import { db } from '~/server/database/client'
import { smartTags } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/authMiddleware'
import type { AddSmartTagRequest } from '~/types'

export default defineEventHandler(async (event) => {
    try {
        const user = await requireAuth(event)
        const body = await readBody<AddSmartTagRequest>(event)

        if (!body.tagType || !body.tagId || !body.name) {
            throw createError({
                statusCode: 400,
                message: 'Tag type, tag ID, and name are required',
            })
        }

        // Create smart tag
        const [tag] = await db.insert(smartTags).values({
            userId: user.id,
            tagType: body.tagType,
            tagId: body.tagId,
            name: body.name,
        }).returning()

        return {
            success: true,
            tag,
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Add smart tag error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to add smart tag',
        })
    }
})
