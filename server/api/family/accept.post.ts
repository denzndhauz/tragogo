import { eq, and } from 'drizzle-orm'
import { db } from '~/server/database/client'
import { invitations, familyMembers, familyGroups, users } from '~/server/database/schema'
import { requireAuth } from '~/server/utils/authMiddleware'
import type { AcceptInviteRequest } from '~/types'

export default defineEventHandler(async (event) => {
    try {
        const user = await requireAuth(event)
        const body = await readBody<AcceptInviteRequest>(event)

        if (!body.code) {
            throw createError({
                statusCode: 400,
                message: 'Invitation code is required',
            })
        }

        // Find invitation
        const invitation = await db.query.invitations.findFirst({
            where: eq(invitations.code, body.code.toUpperCase()),
        })

        if (!invitation) {
            throw createError({
                statusCode: 404,
                message: 'Invalid invitation code',
            })
        }

        // Check if invitation is expired
        if (new Date() > invitation.expiresAt) {
            throw createError({
                statusCode: 400,
                message: 'Invitation has expired',
            })
        }

        // Check if invitation is already accepted
        if (invitation.status === 'accepted') {
            throw createError({
                statusCode: 400,
                message: 'Invitation has already been accepted',
            })
        }

        // Check if user is already a member of the group
        const existingMembership = await db.query.familyMembers.findFirst({
            where: and(
                eq(familyMembers.groupId, invitation.groupId),
                eq(familyMembers.userId, user.id)
            ),
        })

        if (existingMembership) {
            throw createError({
                statusCode: 400,
                message: 'You are already a member of this group',
            })
        }

        // Add user to family group
        await db.insert(familyMembers).values({
            groupId: invitation.groupId,
            userId: user.id,
            role: 'member',
        })

        // Update invitation status
        await db.update(invitations)
            .set({ status: 'accepted' })
            .where(eq(invitations.id, invitation.id))

        // Get group details
        const group = await db.query.familyGroups.findFirst({
            where: eq(familyGroups.id, invitation.groupId),
        })

        return {
            success: true,
            group,
            message: `Successfully joined ${group?.name}`,
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Accept invitation error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to accept invitation',
        })
    }
})
