import { pool } from '~/server/database/client'
import { requireAuth } from '~/server/utils/authMiddleware'

export default defineEventHandler(async (event) => {
    try {
        const user = await requireAuth(event)

        // Set headers for Server-Sent Events
        setResponseHeaders(event, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        })

        // Create a PostgreSQL client for LISTEN
        const client = await pool.connect()

        try {
            // Listen for location updates
            await client.query('LISTEN location_update')

            // Send initial connection message
            event.node.res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`)

            // Handle incoming notifications
            client.on('notification', (msg) => {
                if (msg.channel === 'location_update' && msg.payload) {
                    try {
                        const data = JSON.parse(msg.payload)

                        // Only send updates for family members
                        // TODO: Filter by family group membership
                        event.node.res.write(`data: ${JSON.stringify({
                            type: 'location_update',
                            data,
                        })}\n\n`)
                    } catch (parseError) {
                        console.error('Failed to parse notification:', parseError)
                    }
                }
            })

            // Keep connection alive with heartbeat
            const heartbeat = setInterval(() => {
                event.node.res.write(`: heartbeat\n\n`)
            }, 30000) // Every 30 seconds

            // Clean up on connection close
            event.node.req.on('close', () => {
                clearInterval(heartbeat)
                client.release()
            })

            // Keep the connection open
            await new Promise(() => { })
        } catch (error) {
            client.release()
            throw error
        }
    } catch (error: any) {
        if (error.statusCode) {
            throw error
        }

        console.error('Location stream error:', error)
        throw createError({
            statusCode: 500,
            message: 'Failed to stream locations',
        })
    }
})
