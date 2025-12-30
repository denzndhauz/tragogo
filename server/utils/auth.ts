import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { User } from '~/types'

const SALT_ROUNDS = 10

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(user: User): string {
    const config = useRuntimeConfig()

    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            name: user.name,
        },
        config.jwtSecret,
        {
            expiresIn: '7d',
        }
    )
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): any {
    const config = useRuntimeConfig()

    try {
        return jwt.verify(token, config.jwtSecret)
    } catch (error) {
        return null
    }
}

/**
 * Extract user from authorization header
 */
export function getUserFromHeader(authHeader: string | undefined): any {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }

    const token = authHeader.substring(7)
    return verifyToken(token)
}

/**
 * Generate a random invitation code
 */
export function generateInvitationCode(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''

    for (let i = 0; i < 8; i++) {
        code += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return code
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
    // At least 8 characters
    return password.length >= 8
}
