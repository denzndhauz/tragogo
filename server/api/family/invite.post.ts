import { eq } from 'drizzle-orm'
import { db } from '~/server/database/client'
import { familyGroups, familyMembers, invitations, users } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/authMiddleware'
import { generateInvitationCode } from '~/server/utils/auth'
import { generateQRCode } from '~/server/utils/qrcode'
import { sendEmail, generateInvitationEmail } from '~/server/utils/email'
import type { InviteRequest } from '~/types'

export default defineEventHandler(async (event) => {
    try {
        const user = await requireAuth(event)
        const body = await readBody<InviteRequest>(event)
        const config = useRuntimeConfig()

        if (!body.email) {
            throw createError({
                statusCode: 400,
                message: 'Email is required',
            })
        }

        // Get or create user's family group
        let groupId = body.groupId

        if (!groupId) {
            // Check if user already has a group
            const existingMembership = await db.query.familyMembers.findFirst({
                where: eq(familyMembers.userId, user.id),
            })

            if (existingMembership) {
                groupId = existingMembership.groupId
            } else {
                // Create a new family group
                const [newGroup] = await db.insert(familyGroups).values({
                    name: `${user.name}'s Family`,
                    createdBy: user.id,
                }).returning()

                // Add creator as admin
                await db.insert(familyMembers).values({
                    groupId: newGroup.id,
                    userId: user.id,
                    role: 'admin',
                })

                groupId = newGroup.id
            }
        }

        // Verify user is member of the group
        const membership = await db.query.familyMembers.findFirst({
            where: (members, { and, eq }) => and(
                eq(members.groupId, groupId!),
                eq(members.userId, user.id)
            ),
        })

        if (!membership) {
            throw createError({
                statusCode: 403,
                message: 'You are not a member of this group',
            })
        }

        // Get group details
        const group = await db.query.familyGroups.findFirst({
            where: eq(familyGroups.id, groupId),
        })

        if (!group) {
            throw createError({
                statusCode: 404,
                message: 'Group not found',
            })
        }

        // Generate invitation code
        const code = generateInvitationCode()

        // Generate QR code
        const inviteUrl = `${config.public.appUrl}/invite/${code}`
        const qrCode = await generateQRCode(inviteUrl)

        // Create invitation
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7) // Expires in 7 days

        const [invitation] = await db.insert(invitations).values({
            groupId,
            email: body.email.toLowerCase(),
            code,
            qrCode,
            expiresAt,
        }).returning()

        // Send invitation email
        try {
            const emailHtml = generateInvitationEmail(
                user.name,
                group.name,
                code,
                inviteUrl
            )

            await sendEmail(
                body.email,
                `You're invited to join ${group.name} on Tragogo`,
                emailHtml
            )
        } catch (emailError) {
            console.error('Failed to send invitation email:', emailError)
            // Don't fail the request if email fails
        }

        return {
            invitation,
            inviteUrl,
            qrCode,
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Invitation error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to create invitation',
        })
    }
})
