<template>
  <div ref="mapContainer" class="w-full h-full"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  members?: any[]
  markedLocations?: any[]
  currentLocation?: any
}>()

const emit = defineEmits<{
  centerOnLocation: []
}>()

const mapContainer = ref<HTMLElement | null>(null)
let map: google.maps.Map | null = null
const markers: google.maps.Marker[] = []
let currentLocationMarker: google.maps.Marker | null = null

const initMap = () => {
  if (!mapContainer.value) return

  // Initialize map with clean, Grab-inspired styling
  map = new google.maps.Map(mapContainer.value, {
    center: { lat: 14.5995, lng: 120.9842 }, // Manila, Philippines (default)
    zoom: 16,
    styles: [
      {
        featureType: 'all',
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#e0f2fe' }]
      },
      {
        featureType: 'poi',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#ffffff' }]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#737373' }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{ color: '#f5f5f5' }]
      },
      {
        featureType: 'transit',
        stylers: [{ visibility: 'off' }]
      }
    ],
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.RIGHT_BOTTOM,
    },
  })

  updateMarkers()
}

const updateMarkers = () => {
  if (!map) return

  // Clear existing markers
  markers.forEach(marker => marker.setMap(null))
  markers.length = 0

  // Add current location marker
  if (props.currentLocation) {
    if (currentLocationMarker) {
      currentLocationMarker.setMap(null)
    }

    currentLocationMarker = new google.maps.Marker({
      position: {
        lat: props.currentLocation.latitude,
        lng: props.currentLocation.longitude,
      },
      map,
      title: 'Your Location',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#0e7490', // ocean-600
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 4,
      },
      zIndex: 200,
    })

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 12px; font-family: Inter, sans-serif;">
          <div style="font-weight: 600; color: #171717; margin-bottom: 4px;">Your Location</div>
          <div style="font-size: 12px; color: #737373;">
            Accuracy: ${Math.round(props.currentLocation.accuracy || 0)}m
          </div>
        </div>
      `,
    })

    currentLocationMarker.addListener('click', () => {
      infoWindow.open(map, currentLocationMarker)
    })
  }

  // Add member markers with ocean blue color
  if (props.members) {
    props.members.forEach(member => {
      if (member.latestLocation) {
        const marker = new google.maps.Marker({
          position: {
            lat: parseFloat(member.latestLocation.latitude),
            lng: parseFloat(member.latestLocation.longitude),
          },
          map,
          title: member.user?.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 14,
            fillColor: '#0891b2', // ocean-500
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 4,
          },
          zIndex: 100,
        })

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 12px; font-family: Inter, sans-serif;">
              <div style="font-weight: 600; color: #171717; margin-bottom: 4px;">${member.user?.name}</div>
              <div style="font-size: 12px; color: #737373;">
                Last seen: ${new Date(member.latestLocation.timestamp).toLocaleString()}
              </div>
            </div>
          `,
        })

        marker.addListener('click', () => {
          infoWindow.open(map, marker)
        })

        markers.push(marker)
      }
    })
  }

  // Add marked location markers with teal color
  if (props.markedLocations) {
    props.markedLocations.forEach(location => {
      const marker = new google.maps.Marker({
        position: {
          lat: parseFloat(location.latitude),
          lng: parseFloat(location.longitude),
        },
        map,
        title: location.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: '#14b8a6', // primary-500
          fillOpacity: 0.9,
          strokeColor: '#ffffff',
          strokeWeight: 3,
        },
        zIndex: 50,
      })

      // Add geofence circle
      new google.maps.Circle({
        strokeColor: '#14b8a6',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: '#14b8a6',
        fillOpacity: 0.1,
        map,
        center: {
          lat: parseFloat(location.latitude),
          lng: parseFloat(location.longitude),
        },
        radius: location.radius,
      })

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; font-family: Inter, sans-serif;">
            <div style="font-weight: 600; color: #171717; margin-bottom: 4px;">${location.name}</div>
            <div style="font-size: 12px; color: #737373; text-transform: capitalize;">
              ${location.type} • ${location.radius}m radius
            </div>
          </div>
        `,
      })

      marker.addListener('click', () => {
        infoWindow.open(map, marker)
      })

      markers.push(marker)
    })
  }

  // Fit bounds to show all markers including current location
  if (markers.length > 0 || currentLocationMarker) {
    const bounds = new google.maps.LatLngBounds()
    markers.forEach(marker => {
      const position = marker.getPosition()
      if (position) bounds.extend(position)
    })
    if (currentLocationMarker) {
      const position = currentLocationMarker.getPosition()
      if (position) bounds.extend(position)
    }
    map.fitBounds(bounds)
    
    // Adjust zoom if only one marker
    if (markers.length === 1 && !currentLocationMarker) {
      map.setZoom(15)
    } else if (!markers.length && currentLocationMarker) {
      map.setZoom(15)
    }
  }
}

const centerOnCurrentLocation = () => {
  if (currentLocationMarker && map) {
    const position = currentLocationMarker.getPosition()
    if (position) {
      map.panTo(position)
      map.setZoom(13) // ~600m view range
    }
  }
}

const centerOnMember = (member: any) => {
  if (map && member.latestLocation) {
    const position = {
      lat: parseFloat(member.latestLocation.latitude),
      lng: parseFloat(member.latestLocation.longitude),
    }
    map.panTo(position)
    map.setZoom(6)
  }
}

const centerOnMarkedLocation = (location: any) => {
  if (map) {
    const position = {
      lat: parseFloat(location.latitude),
      lng: parseFloat(location.longitude),
    }
    map.panTo(position)
    map.setZoom(6)
  }
}

onMounted(() => {
  // Wait for Google Maps API to load
  const checkGoogleMaps = setInterval(() => {
    if (window.google && window.google.maps) {
      clearInterval(checkGoogleMaps)
      initMap()
    }
  }, 100)
})

// Watch for prop changes
watch(() => [props.members, props.markedLocations, props.currentLocation], () => {
  updateMarkers()
}, { deep: true })

defineExpose({
  centerOnCurrentLocation,
  centerOnMember,
  centerOnMarkedLocation,
})
</script>
