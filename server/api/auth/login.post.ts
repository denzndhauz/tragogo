import { eq } from 'drizzle-orm'
import { db } from '~/server/database/client'
import { users } from '~/server/database/schema'
import { verifyPassword, generateToken } from '~/server/utils/auth'
import type { LoginRequest, AuthResponse } from '~/types'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<LoginRequest>(event)

        // Validate input
        if (!body.email || !body.password) {
            throw createError({
                statusCode: 400,
                message: 'Email and password are required',
            })
        }

        // Find user
        const user = await db.query.users.findFirst({
            where: eq(users.email, body.email.toLowerCase()),
        })

        if (!user) {
            throw createError({
                statusCode: 401,
                message: 'Invalid email or password',
            })
        }

        // Verify password
        const isValidPassword = await verifyPassword(body.password, user.password)

        if (!isValidPassword) {
            throw createError({
                statusCode: 401,
                message: 'Invalid email or password',
            })
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user

        // Generate token
        const token = generateToken(userWithoutPassword)

        const response: AuthResponse = {
            user: userWithoutPassword,
            token,
        }

        return response
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Login error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to login',
        })
    }
})
