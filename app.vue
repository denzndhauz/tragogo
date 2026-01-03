<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Capacitor } from '@capacitor/core'

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

const colorMode = useColorMode()

onMounted(async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      await StatusBar.setOverlaysWebView({ overlay: true })
      updateStatusBarStyle()
    } catch (e) {
      console.warn('StatusBar not available', e)
    }
  }
})

const updateStatusBarStyle = async () => {
  if (!Capacitor.isNativePlatform()) return
  
  try {
    // Style.Dark = White text (for dark backgrounds)
    // Style.Light = Dark text (for light backgrounds)
    const isDark = colorMode.value === 'dark'
    await StatusBar.setStyle({ 
      style: isDark ? Style.Dark : Style.Light 
    })
  } catch (e) {
    console.error('Failed to update status bar style:', e)
  }
}

// Update status bar when theme changes
watch(() => colorMode.value, () => {
  updateStatusBarStyle()
})
</script>
