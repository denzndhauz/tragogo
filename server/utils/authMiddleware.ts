import { getUserFromHeader } from '~/server/utils/auth'
import type { H3Event } from 'h3'

/**
 * Middleware to require authentication for protected routes
 * Usage: const user = await requireAuth(event)
 */
export async function requireAuth(event: H3Event) {
    const authHeader = getHeader(event, 'authorization')
    const user = getUserFromHeader(authHeader)

    if (!user) {
        throw createError({
            statusCode: 401,
            message: 'Authentication required',
        })
    }

    return user
}

/**
 * Middleware to optionally get authenticated user
 * Returns null if not authenticated
 */
export async function optionalAuth(event: H3Event) {
    const authHeader = getHeader(event, 'authorization')
    return getUserFromHeader(authHeader)
}
