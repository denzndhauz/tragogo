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
      // Show immediately
      await StatusBar.show()
      await StatusBar.setOverlaysWebView({ overlay: true })
      await updateStatusBarStyle()
      
      // Retry after a short delay to ensure UI is ready
      setTimeout(async () => {
        await StatusBar.show()
        await updateStatusBarStyle()
      }, 300)
    } catch (e) {
      console.warn('StatusBar initialization error:', e)
    }
  }
})

const updateStatusBarStyle = async () => {
  if (!Capacitor.isNativePlatform()) return
  
  try {
    // Force show the status bar just in case it was hidden
    await StatusBar.show()
    
    // Style.Dark = White text (for dark backgrounds)
    // Style.Light = Dark text (for light backgrounds)
    // We check colorMode.value which is the actually applied theme ('light' or 'dark')
    const isDark = colorMode.value === 'dark'
    await StatusBar.setStyle({ 
      style: isDark ? Style.Dark : Style.Light 
    })
    
    console.log(`Status bar style updated to: ${isDark ? 'Dark (White text)' : 'Light (Dark text)'}`)
  } catch (e) {
    console.error('Failed to update status bar style:', e)
  }
}

// Update status bar when theme changes
watch(() => colorMode.value, async () => {
  await StatusBar.show()
  await updateStatusBarStyle()
})
</script>
