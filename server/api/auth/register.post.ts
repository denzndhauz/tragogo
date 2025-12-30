import { eq } from 'drizzle-orm'
import { db } from '~/server/database/client'
import { users } from '~/server/database/schema'
import { hashPassword, generateToken, isValidEmail, isValidPassword } from '~/server/utils/auth'
import type { RegisterRequest, AuthResponse } from '~/types'

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody<RegisterRequest>(event)

        // Validate input
        if (!body.email || !body.password || !body.name) {
            throw createError({
                statusCode: 400,
                message: 'Email, password, and name are required',
            })
        }

        if (!isValidEmail(body.email)) {
            throw createError({
                statusCode: 400,
                message: 'Invalid email format',
            })
        }

        if (!isValidPassword(body.password)) {
            throw createError({
                statusCode: 400,
                message: 'Password must be at least 8 characters long',
            })
        }

        // Check if user already exists
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, body.email.toLowerCase()),
        })

        if (existingUser) {
            throw createError({
                statusCode: 409,
                message: 'User with this email already exists',
            })
        }

        // Hash password
        const hashedPassword = await hashPassword(body.password)

        // Create user
        const [newUser] = await db.insert(users).values({
            email: body.email.toLowerCase(),
            password: hashedPassword,
            name: body.name,
        }).returning()

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser

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

        console.error('Registration error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to register user',
        })
    }
})
