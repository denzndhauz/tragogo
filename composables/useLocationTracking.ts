import { ref, onMounted, onUnmounted } from 'vue'

export interface LocationData {
    latitude: number
    longitude: number
    accuracy?: number
}

export const useLocationTracking = () => {
    const location = ref<LocationData | null>(null)
    const error = ref<string | null>(null)
    const isTracking = ref(false)
    const watchId = ref<number | null>(null)

    const startTracking = () => {
        if (!navigator.geolocation) {
            error.value = 'Geolocation is not supported by your browser'
            return
        }

        isTracking.value = true
        error.value = null

        // Get initial position
        navigator.geolocation.getCurrentPosition(
            (position) => {
                location.value = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                }

                // Send to server
                updateLocationOnServer(location.value)
            },
            (err) => {
                error.value = err.message
                isTracking.value = false
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        )

        // Watch position changes
        watchId.value = navigator.geolocation.watchPosition(
            (position) => {
                location.value = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                }

                // Send to server
                updateLocationOnServer(location.value)
            },
            (err) => {
                error.value = err.message
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 30000, // Update at most every 30 seconds
            }
        )
    }

    const stopTracking = () => {
        if (watchId.value !== null) {
            navigator.geolocation.clearWatch(watchId.value)
            watchId.value = null
        }
        isTracking.value = false
    }

    const updateLocationOnServer = async (loc: LocationData) => {
        try {
            const token = localStorage.getItem('auth_token')

            if (!token) {
                return
            }

            await $fetch('/api/location/update', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: loc,
            })
        } catch (err) {
            console.error('Failed to update location on server:', err)
        }
    }

    onUnmounted(() => {
        stopTracking()
    })

    return {
        location,
        error,
        isTracking,
        startTracking,
        stopTracking,
    }
}
