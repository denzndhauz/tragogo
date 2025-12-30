import { getUserFromHeader } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        const authHeader = getHeader(event, 'authorization')
        const user = getUserFromHeader(authHeader)

        if (!user) {
            throw createError({
                statusCode: 401,
                message: 'Not authenticated',
            })
        }

        return { user }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            message: 'Failed to get user info',
        })
    }
})
