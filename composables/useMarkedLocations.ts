import { ref } from 'vue'
import type { MarkedLocation, CreateMarkedLocationRequest } from '~/types'

export const useMarkedLocations = () => {
    const locations = ref<MarkedLocation[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    const { getAuthHeaders } = useAuth()
    const { location: currentLocation } = useLocationTracking()

    const fetchLocations = async () => {
        loading.value = true
        error.value = null

        try {
            const response = await $fetch('/api/locations/marked/list', {
                headers: getAuthHeaders(),
            })
            locations.value = response.locations || []
        } catch (err: any) {
            error.value = err.message || 'Failed to fetch locations'
            console.error('Failed to fetch marked locations:', err)
        } finally {
            loading.value = false
        }
    }

    const createLocation = async (data: CreateMarkedLocationRequest) => {
        loading.value = true
        error.value = null

        try {
            const response = await $fetch('/api/locations/marked/create', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: data,
            })

            if (response.location) {
                locations.value.push(response.location)
            }

            return response.location
        } catch (err: any) {
            error.value = err.message || 'Failed to create location'
            console.error('Failed to create marked location:', err)
            throw err
        } finally {
            loading.value = false
        }
    }

    const markCurrentLocation = async (name: string, type: 'home' | 'work' | 'school' | 'other' = 'other') => {
        if (!currentLocation.value) {
            error.value = 'Current location is not available'
            return
        }

        return createLocation({
            name,
            type,
            latitude: currentLocation.value.latitude,
            longitude: currentLocation.value.longitude,
            radius: 100,
            notifyOnArrival: true,
        })
    }

    return {
        locations,
        loading,
        error,
        fetchLocations,
        createLocation,
        markCurrentLocation,
    }
}
