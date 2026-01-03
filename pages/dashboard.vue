<template>
  <div class="h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
    <!-- Top Bar -->
    <div class="pt-safe pb-3 px-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between z-10 transition-colors duration-300">
      <div class="flex items-center gap-3">
        <div 
          v-if="user?.profileIcon" 
          class="w-10 h-10 rounded-full overflow-hidden"
        >
          <img :src="user.profileIcon" :alt="user.name" class="w-full h-full object-cover" />
        </div>
        <div v-else class="avatar">
          {{ user?.name?.charAt(0).toUpperCase() }}
        </div>
        <div>
          <div class="font-semibold text-neutral-900 dark:text-neutral-100">{{ user?.name }}</div>
          <div class="flex items-center gap-1.5 text-xs">
            <div :class="isTracking ? 'w-1.5 h-1.5 bg-success-500 rounded-full' : 'w-1.5 h-1.5 bg-neutral-400 rounded-full'"></div>
            <span :class="isTracking ? 'text-success-600' : 'text-neutral-500'">
              {{ isTracking ? 'Tracking active' : 'Tracking off' }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <ThemeToggle />
        <button @click="handleLogout" class="tap-target flex items-center justify-center">
          <svg class="w-5 h-5 text-neutral-600 dark:text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Map Container - 60% height -->
    <div class="h-[60%] relative">
      <MapView ref="mapRef" :members="members" :marked-locations="markedLocations" :current-location="currentLocation" />
      
      <!-- Center on Location Button -->
      <button 
        v-if="currentLocation"
        @click="mapRef?.centerOnCurrentLocation()" 
        class="absolute top-4 right-20 bg-white dark:bg-neutral-800 text-ocean-600 dark:text-ocean-400 shadow-md p-3 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-700 active:scale-[0.95] transition-all z-10 tap-target"
        title="Center on your location"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0-2c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6 2.69-6 6-6zm0 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm8-8v-4H2v4H0V4h24v8h-2z" />
        </svg>
      </button>
      
      <!-- Tracking Toggle FAB -->
      <button 
        @click="toggleTracking" 
        class="fab no-select"
        :class="isTracking ? 'bg-ocean-500' : 'bg-neutral-400'"
      >
        <svg v-if="isTracking" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      </button>
    </div>

    <!-- Bottom Sheet - 40% height -->
    <div class="h-[40%] bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 safe-bottom flex flex-col transition-colors duration-300">
      <!-- Tab Bar -->
      <div class="flex border-b border-neutral-200 dark:border-neutral-800 flex-shrink-0">
        <button 
          @click="activeTab = 'family'"
          :class="[
            'flex-1 py-3 text-sm font-medium transition-colors no-select',
            activeTab === 'family' ? 'text-ocean-600 border-b-2 border-ocean-600' : 'text-neutral-500'
          ]"
        >
          Family
        </button>
        <button 
          @click="activeTab = 'locations'"
          :class="[
            'flex-1 py-3 text-sm font-medium transition-colors no-select',
            activeTab === 'locations' ? 'text-ocean-600 border-b-2 border-ocean-600' : 'text-neutral-500'
          ]"
        >
          Locations
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto smooth-scroll">
        <!-- Family Tab -->
        <div v-if="activeTab === 'family'" class="p-4">
          <button @click="showInviteModal = true" class="btn-primary mb-4">
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Invite Family Member
            </span>
          </button>

          <div v-if="members.length === 0" class="text-center py-8">
            <svg class="w-16 h-16 mx-auto text-neutral-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-sm text-neutral-600">No family members yet</p>
            <p class="text-xs text-neutral-500 mt-1">Invite someone to get started</p>
          </div>

          <div v-else class="space-y-2">
            <!-- Current User (You) -->
            <button 
              @click="mapRef?.centerOnCurrentLocation()"
              :disabled="!currentLocation"
              class="w-full text-left list-item rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors active:bg-neutral-200 dark:active:bg-neutral-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div 
                v-if="user?.profileIcon" 
                class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-ocean-500"
              >
                <img :src="user.profileIcon" :alt="user.name" class="w-full h-full object-cover" />
              </div>
              <div v-else class="avatar flex-shrink-0 border-2 border-ocean-500">
                {{ user?.name?.charAt(0).toUpperCase() }}
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="font-medium text-neutral-900 dark:text-neutral-100 truncate">{{ user?.name }} (You)</div>
                <div class="text-xs text-neutral-500">
                  {{ isTracking ? 'Tracking active' : 'Tracking off' }}
                </div>
              </div>

              <span 
                :class="[
                  'status-badge',
                  isTracking ? 'status-online' : 'status-offline'
                ]"
              >
                {{ isTracking ? 'Active' : 'Offline' }}
              </span>
            </button>

            <!-- Other Family Members -->
            <button 
              v-for="member in otherMembers" 
              :key="member.id"
              @click="centerOnMember(member)"
              :disabled="!member.latestLocation"
              class="w-full text-left list-item rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors active:bg-neutral-200 dark:active:bg-neutral-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <div 
                v-if="member.user?.profileIcon" 
                class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
              >
                <img :src="member.user.profileIcon" :alt="member.user.name" class="w-full h-full object-cover" />
              </div>
              <div v-else class="avatar flex-shrink-0">
                {{ member.user?.name?.charAt(0).toUpperCase() }}
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="font-medium text-neutral-900 dark:text-neutral-100 truncate">{{ member.user?.name }}</div>
                <div class="text-xs text-neutral-500">
                  {{ member.latestLocation ? 'Active now' : 'Offline' }}
                </div>
              </div>

              <span 
                :class="[
                  'status-badge',
                  member.latestLocation ? 'status-online' : 'status-offline'
                ]"
              >
                {{ member.latestLocation ? 'Online' : 'Offline' }}
              </span>
            </button>
          </div>
        </div>

        <!-- Locations Tab -->
        <div v-if="activeTab === 'locations'" class="p-4 space-y-2">
          <button @click="showLocationModal = true" class="btn-primary w-full mb-4">
            <span class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Location
            </span>
          </button>

          <div v-if="markedLocations.length === 0" class="text-center py-6">
            <svg class="w-12 h-12 mx-auto text-neutral-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            </svg>
            <p class="text-sm text-neutral-600">No marked locations</p>
            <p class="text-xs text-neutral-500 mt-1">Add home, work, or other places</p>
          </div>

          <div v-else class="space-y-2">
            <button
              v-for="location in markedLocations" 
              :key="location.id"
              @click="centerOnMarkedLocation(location)"
              class="w-full text-left list-item rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors active:bg-neutral-200 dark:active:bg-neutral-700"
            >
              <div class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              
              <div class="flex-1 min-w-0">
                <div class="font-medium text-neutral-900 dark:text-neutral-100 truncate">{{ location.name }}</div>
                <div class="text-xs text-neutral-500 capitalize">{{ location.type }} • {{ location.radius }}m</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div v-if="showInviteModal" class="fixed inset-0 bg-black/50 flex items-end z-50" @click.self="showInviteModal = false">
      <div class="bottom-sheet animate-slide-up w-full">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-neutral-900 dark:text-neutral-100">Invite Family Member</h2>
          <button @click="showInviteModal = false" class="tap-target">
            <svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p class="text-neutral-600 dark:text-neutral-400 mb-6">Feature coming soon! You'll be able to invite family members via email, QR code, or invitation link.</p>
        <button @click="showInviteModal = false" class="btn-primary">Got it</button>
      </div>
    </div>

    <!-- Location Selector Modal - Full Screen -->
    <div v-if="showLocationModal" class="fixed inset-0 bg-white dark:bg-neutral-900 z-50 flex flex-col transition-colors duration-300">
      <!-- Header -->
      <div class="flex-shrink-0 safe-top bg-white border-b border-neutral-200 px-6 py-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Add Location</h2>
          <button @click="showLocationModal = false" class="tap-target">
            <svg class="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            id="location-search-input"
            v-model="locationSearchQuery"
            type="text"
            placeholder="Search for a location..."
            class="w-full pl-10 pr-4 py-3 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:border-ocean-500 text-neutral-900 dark:text-neutral-100"
          />
        </div>

        <!-- Selected Address Display -->
        <div v-if="selectedLocation" class="mt-3 p-3 bg-ocean-50 dark:bg-ocean-950 rounded-xl border border-ocean-100 dark:border-ocean-900 flex items-start gap-2">
          <svg class="w-5 h-5 text-ocean-600 dark:text-ocean-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          <div>
            <p class="text-xs font-semibold text-ocean-900">Selected Location</p>
            <p class="text-xs text-ocean-700 leading-relaxed">{{ selectedLocation.address }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto smooth-scroll">
        <!-- Location Name Input -->
        <div class="px-6 py-6 border-b border-neutral-200 dark:border-neutral-800">
          <label class="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Location Name</label>
          <input 
            v-model="locationName"
            type="text"
            placeholder="e.g., Home, Work, School"
            class="input-field"
          />
        </div>

        <!-- Location Type Selection -->
        <div class="px-6 py-6 border-b border-neutral-200 dark:border-neutral-800">
          <label class="block text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Location Type</label>
          <div class="flex gap-2">
            <button
              v-for="type in ['home', 'work', 'school', 'other']"
              :key="type"
              @click="locationType = type as any"
              :class="[
                'flex-1 py-3 px-4 rounded-lg font-medium text-sm transition-all capitalize',
                locationType === type 
                  ? 'bg-ocean-500 text-white' 
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              ]"
            >
              {{ type }}
            </button>
          </div>
        </div>

        <!-- Current Location Display -->
        <div class="px-6 py-6 border-b border-neutral-200 dark:border-neutral-800">
          <div v-if="currentLocation" class="p-4 bg-ocean-50 dark:bg-ocean-950 border border-ocean-200 dark:border-ocean-900 rounded-2xl">
            <p class="text-sm font-semibold text-ocean-900 dark:text-ocean-100 mb-2">Current Location</p>
            <div class="text-xs text-ocean-700 space-y-1">
              <div>Latitude: {{ currentLocation.latitude.toFixed(6) }}</div>
              <div>Longitude: {{ currentLocation.longitude.toFixed(6) }}</div>
              <div>Accuracy: {{ Math.round(currentLocation.accuracy || 0) }}m</div>
            </div>
          </div>
          <div v-else class="p-4 bg-warning-50 dark:bg-warning-950 border border-warning-200 dark:border-warning-900 rounded-2xl">
            <p class="text-sm font-semibold text-warning-900 dark:text-warning-100">Location Not Available</p>
            <p class="text-xs text-warning-700 dark:text-warning-400">Please enable tracking to mark your current location.</p>
          </div>
        </div>

        <!-- Suggested/Recent Locations -->
        <div v-if="filteredLocationSuggestions.length > 0" class="px-6 py-6 border-b border-neutral-200 dark:border-neutral-800">
          <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Popular Locations</p>
          <div class="space-y-2">
            <button
              v-for="suggestion in filteredLocationSuggestions"
              :key="suggestion"
              @click="locationName = suggestion"
              :class="[
                'w-full text-left p-3 rounded-xl border transition-all',
                locationName === suggestion 
                  ? 'bg-ocean-50 dark:bg-ocean-950 border-ocean-300 dark:border-ocean-700' 
                  : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:border-ocean-300 dark:hover:border-ocean-600'
              ]"
            >
              <div class="font-medium text-neutral-900 dark:text-neutral-100">{{ suggestion }}</div>
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="locationError" class="px-6 py-4 bg-danger-50 border-b border-danger-200">
          <p class="text-sm text-danger-700">{{ locationError }}</p>
        </div>
      </div>

      <!-- Fixed Action Buttons -->
      <div class="flex-shrink-0 flex gap-3 px-6 py-4 border-t border-neutral-200 safe-bottom bg-white">
        <button 
          @click="showLocationModal = false"
          class="flex-1 py-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="handleAddLocation"
          :disabled="!locationName || !selectedLocation || locationLoading"
          class="flex-1 btn-primary disabled:opacity-40 disabled:bg-neutral-200 disabled:text-neutral-500 disabled:shadow-none"
        >
          {{ locationLoading ? 'Saving...' : 'Mark Location' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import MapView from '~/components/MapView.vue'
declare const google: any
const { user, logout, isAuthenticated, getAuthHeaders } = useAuth()
const { startTracking, stopTracking, isTracking, location: currentLocation } = useLocationTracking()
const { fetchLocations: fetchMarkedLocations, createLocation, markCurrentLocation, loading: locationLoading, error: locationError } = useMarkedLocations()
const router = useRouter()

const activeTab = ref('family')
const showInviteModal = ref(false)
const showLocationModal = ref(false)
const members = ref<any[]>([])
const markedLocations = ref<any[]>([])
const mapRef = ref<InstanceType<typeof MapView> | null>(null)
const locationName = ref('')
const locationType = ref<'home' | 'work' | 'school' | 'other'>('other')
const locationSearchQuery = ref('')
const selectedLocation = ref<{ address: string, latitude: number, longitude: number } | null>(null)
let autocomplete: any = null

// Location suggestions for search
const locationSuggestions = [
  'Home',
  'Work',
  'School',
  'Gym',
  'Hospital',
  'Grocery Store',
  'Coffee Shop',
  'Park',
  'Library',
  'Restaurant',
]

const filteredLocationSuggestions = computed(() => {
  if (!locationSearchQuery.value) return locationSuggestions
  return locationSuggestions.filter(loc =>
    loc.toLowerCase().includes(locationSearchQuery.value.toLowerCase())
  )
})

const otherMembers = computed(() => {
  if (!user.value) return members.value
  return members.value.filter(m => m.userId !== user.value.id)
})

// Redirect if not authenticated
if (!isAuthenticated.value) {
  router.push('/')
}

// Fetch family members
const fetchMembers = async () => {
  try {
    const response = await $fetch('/api/family/members', {
      headers: getAuthHeaders() as any,
    })
    members.value = response.members || []
  } catch (error) {
    console.error('Failed to fetch members:', error)
  }
}

// Fetch marked locations
const fetchLocations = async () => {
  try {
    const response = await $fetch('/api/locations/marked/list', {
      headers: getAuthHeaders() as any,
    })
    markedLocations.value = response.locations || []
  } catch (error) {
    console.error('Failed to fetch locations:', error)
  }
}

const handleAddLocation = async () => {
  if (!locationName.value || !selectedLocation.value) {
    return
  }

  try {
    await createLocation({
      name: locationName.value,
      type: locationType.value,
      latitude: selectedLocation.value.latitude,
      longitude: selectedLocation.value.longitude,
      radius: 100,
      notifyOnArrival: true,
    })

    // Reset form and close modal
    locationName.value = ''
    locationType.value = 'other'
    showLocationModal.value = false

    // Refresh locations list
    await fetchLocations()
  } catch (error) {
    console.error('Failed to add location:', error)
  }
}

onMounted(() => {
  fetchMembers()
  fetchLocations()
  startTracking()
})

const toggleTracking = () => {
  if (isTracking.value) {
    stopTracking()
  } else {
    startTracking()
  }
}

const handleLogout = () => {
  stopTracking()
  logout()
  router.push('/')
}

const centerOnMarkedLocation = (location: any) => {
  if (mapRef.value) {
    mapRef.value.centerOnMarkedLocation(location)
  }
}

const centerOnMember = (member: any) => {
  if (mapRef.value && member.latestLocation) {
    mapRef.value.centerOnMember(member)
  }
}

// Initialize Google Places Autocomplete when modal opens
watch(showLocationModal, (isVisible: boolean) => {
  if (isVisible) {
    nextTick(() => {
      const input = document.getElementById('location-search-input') as HTMLInputElement
      if (input && !autocomplete) {
        autocomplete = new google.maps.places.Autocomplete(input, {
          fields: ['address_components', 'geometry', 'name', 'formatted_address'],
          types: ['establishment', 'geocode']
        })

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete?.getPlace()
          if (place?.geometry?.location) {
            selectedLocation.value = {
              address: place.formatted_address || place.name || '',
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng()
            }
            // Optional: auto-fill name if empty
            if (!locationName.value) {
              locationName.value = place.name || ''
            }
          }
        })
      }
    })
  } else {
    // Reset selection when modal closes
    selectedLocation.value = null
    locationSearchQuery.value = ''
    autocomplete = null
  }
})
</script>

<style scoped>
.animate-slide-up {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
