<template>
  <div class="min-h-screen bg-gradient-to-b from-ocean-50 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 flex flex-col transition-colors duration-300">
    <!-- Header with logo -->
    <div class="safe-top bg-gradient-to-b from-ocean-50 to-transparent px-6 pt-8 pb-6 flex-shrink-0">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <img src="/assets/img/image.png" alt="Tragogo Logo" class="w-12 h-12 object-contain rounded-xl" />
          <div class="space-y-0.5">
            <h1 class="text-3xl font-bold text-ocean-900 tracking-tight">Tragogo</h1>
            <p class="text-ocean-600 font-medium text-sm">Keep your family safe</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <NuxtLink to="/login" class="flex-shrink-0">
            <button class="px-8 py-3 bg-ocean-500 text-white font-semibold rounded-xl shadow-md hover:bg-ocean-600 active:scale-[0.98] transition-all duration-150 whitespace-nowrap">
              Sign In
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Scrollable Features Section -->
    <div class="flex-1 overflow-y-auto smooth-scroll px-6 py-6">
      <div class="space-y-4 max-w-2xl">
        <div class="flex items-start gap-4 p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm hover:shadow-md dark:shadow-none border border-transparent dark:border-neutral-800 transition-all">
          <div class="w-12 h-12 rounded-2xl bg-ocean-100 dark:bg-ocean-950 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-ocean-600 dark:text-ocean-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Track Family Members</h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">Real-time location sharing with your loved ones</p>
          </div>
        </div>

        <div class="flex items-start gap-4 p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm hover:shadow-md dark:shadow-none border border-transparent dark:border-neutral-800 transition-all">
          <div class="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-950 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Smart Geofencing</h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">Get notified when family arrives home or at work</p>
          </div>
        </div>

        <div class="flex items-start gap-4 p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm hover:shadow-md dark:shadow-none border border-transparent dark:border-neutral-800 transition-all">
          <div class="w-12 h-12 rounded-2xl bg-success-100 dark:bg-success-950 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Easy Invites</h3>
            <p class="text-sm text-neutral-600 dark:text-neutral-400">Share via email, QR code, or invitation link</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Safe area bottom padding -->
    <div class="safe-bottom bg-white dark:bg-neutral-950 transition-colors duration-300"></div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Tragogo - Keep your family safe'
})
</script>
