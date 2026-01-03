<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Capacitor } from '@capacitor/core'

useHead({
  htmlAttrs: {
    lang: 'en'
  }
})

onMounted(async () => {
  if (Capacitor.isNativePlatform()) {
    try {
      // Make status bar overlay the webview
      await StatusBar.setOverlaysWebView({ overlay: true })
      // Use light content for status bar if background is dark, or dark content for light background
      await StatusBar.setStyle({ style: Style.Default })
    } catch (e) {
      console.warn('StatusBar not available', e)
    }
  }
})
</script>
