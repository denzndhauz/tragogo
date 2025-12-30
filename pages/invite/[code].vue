<template>
  <div class="min-h-screen bg-white flex flex-col">
    <div class="safe-top"></div>
    
    <div class="flex-1 flex flex-col px-6 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-ocean-100 flex items-center justify-center">
          <svg class="w-10 h-10 text-ocean-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-neutral-900 mb-2">Join Family Group</h1>
        <p class="text-neutral-600">Enter your invitation code to connect with your family</p>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="mb-6 p-4 bg-success-50 border border-success-200 rounded-xl">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-success-700">{{ success }}</p>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-xl">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm text-danger-700">{{ error }}</p>
        </div>
      </div>

      <!-- Form -->
      <form v-if="!success" @submit.prevent="handleAccept" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-neutral-700 mb-2">Invitation Code</label>
          <input 
            v-model="inviteCode" 
            type="text" 
            required 
            class="input-field text-center text-2xl font-bold tracking-[0.5em] uppercase" 
            placeholder="XXXXXXXX"
            maxlength="8"
            autocomplete="off"
          />
          <p class="text-xs text-neutral-500 mt-2">Enter the 8-character code from your invitation</p>
        </div>

        <button type="submit" :disabled="loading || inviteCode.length !== 8" class="btn-primary">
          {{ loading ? 'Accepting...' : 'Accept Invitation' }}
        </button>
      </form>

      <!-- Success Actions -->
      <div v-else class="space-y-3">
        <button @click="router.push('/dashboard')" class="btn-primary">
          Go to Dashboard
        </button>
      </div>

      <!-- Back Link -->
      <div class="mt-auto pt-8 text-center">
        <NuxtLink to="/" class="text-ocean-600 font-medium">
          ← Back to Home
        </NuxtLink>
      </div>
    </div>

    <div class="safe-bottom"></div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { getAuthHeaders, isAuthenticated } = useAuth()

const inviteCode = ref(route.params.code as string || '')
const loading = ref(false)
const error = ref('')
const success = ref('')

// Redirect if not authenticated
if (!isAuthenticated.value) {
  router.push('/')
}

const handleAccept = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await $fetch('/api/family/accept', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: {
        code: inviteCode.value,
      },
    })

    success.value = response.message || 'Successfully joined the family group!'
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to accept invitation'
  } finally {
    loading.value = false
  }
}

// Auto-accept if code is in URL
onMounted(() => {
  if (inviteCode.value && inviteCode.value.length === 8) {
    handleAccept()
  }
})
</script>
