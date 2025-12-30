import { ref, onMounted, onUnmounted } from 'vue'

export interface LocationUpdate {
    userId: number
    latitude: number
    longitude: number
    accuracy?: number
    timestamp: Date
}

export const useLocationStream = () => {
    const updates = ref<LocationUpdate[]>([])
    const isConnected = ref(false)
    const error = ref<string | null>(null)
    let eventSource: EventSource | null = null

    const connect = () => {
        const token = localStorage.getItem('auth_token')

        if (!token) {
            error.value = 'Not authenticated'
            return
        }

        try {
            // Create EventSource for Server-Sent Events
            eventSource = new EventSource(`/api/location/stream`, {
                withCredentials: true,
            })

            eventSource.onopen = () => {
                isConnected.value = true
                error.value = null
            }

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data)

                    if (data.type === 'location_update') {
                        updates.value.push(data.data)

                        // Keep only last 100 updates
                        if (updates.value.length > 100) {
                            updates.value.shift()
                        }
                    }
                } catch (err) {
                    console.error('Failed to parse location update:', err)
                }
            }

            eventSource.onerror = () => {
                isConnected.value = false
                error.value = 'Connection lost. Reconnecting...'

                // Auto-reconnect after 5 seconds
                setTimeout(() => {
                    if (eventSource) {
                        eventSource.close()
                        connect()
                    }
                }, 5000)
            }
        } catch (err) {
            error.value = 'Failed to connect to location stream'
            console.error(err)
        }
    }

    const disconnect = () => {
        if (eventSource) {
            eventSource.close()
            eventSource = null
            isConnected.value = false
        }
    }

    onUnmounted(() => {
        disconnect()
    })

    return {
        updates,
        isConnected,
        error,
        connect,
        disconnect,
    }
}
