<template>
  <div class="min-h-screen bg-gradient-to-b from-ocean-50 to-neutral-50 flex flex-col justify-center items-center px-6 py-8">
    <!-- Container -->
    <div class="w-full max-w-md">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-ocean-900 mb-2">Tragogo</h1>
        <p class="text-ocean-600 font-medium">Keep your family safe</p>
      </div>

      <!-- Auth Card -->
      <div class="bg-white rounded-3xl shadow-lg p-8">
        <!-- Auth Toggle -->
        <div class="flex bg-neutral-100 rounded-2xl p-1.5 mb-8 shadow-sm">
          <button 
            @click="showRegister = false"
            :class="[
              'flex-1 py-3 rounded-xl font-semibold transition-all no-select text-sm',
              !showRegister ? 'bg-white text-ocean-600 shadow-card' : 'text-neutral-600'
            ]"
          >
            Sign In
          </button>
          <button 
            @click="showRegister = true"
            :class="[
              'flex-1 py-3 rounded-xl font-semibold transition-all no-select text-sm',
              showRegister ? 'bg-white text-ocean-600 shadow-card' : 'text-neutral-600'
            ]"
          >
            Sign Up
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-2xl">
          <p class="text-sm font-medium text-danger-700">{{ error }}</p>
        </div>

        <!-- Login Form -->
        <form v-if="!showRegister" @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="label-field">Email</label>
            <input 
              v-model="loginForm.email" 
              type="email" 
              required 
              class="input-field" 
              placeholder="your@email.com"
              autocomplete="email"
            />
          </div>

          <div>
            <label class="label-field">Password</label>
            <input 
              v-model="loginForm.password" 
              type="password" 
              required 
              class="input-field" 
              placeholder="Enter your password"
              autocomplete="current-password"
            />
          </div>

          <button type="submit" :disabled="loading" class="btn-primary mt-6">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Register Form -->
        <form v-else @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="label-field">Full Name</label>
            <input 
              v-model="registerForm.name" 
              type="text" 
              required 
              class="input-field" 
              placeholder="John Doe"
              autocomplete="name"
            />
          </div>

          <div>
            <label class="label-field">Email</label>
            <input 
              v-model="registerForm.email" 
              type="email" 
              required 
              class="input-field" 
              placeholder="your@email.com"
              autocomplete="email"
            />
          </div>

          <div>
            <label class="label-field">Password</label>
            <input 
              v-model="registerForm.password" 
              type="password" 
              required 
              minlength="8"
              class="input-field" 
              placeholder="At least 8 characters"
              autocomplete="new-password"
            />
          </div>

          <button type="submit" :disabled="loading" class="btn-primary mt-6">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>
      </div>

      <!-- Back link -->
      <div class="text-center mt-6">
        <NuxtLink to="/" class="text-sm text-ocean-600 font-medium hover:text-ocean-700">
          ← Back to Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login, register } = useAuth()
const router = useRouter()

const showRegister = ref(false)
const loading = ref(false)
const error = ref('')

const loginForm = ref({
  email: '',
  password: '',
})

const registerForm = ref({
  name: '',
  email: '',
  password: '',
})

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await login(loginForm.value.email, loginForm.value.password)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  try {
    await register(registerForm.value.email, registerForm.value.password, registerForm.value.name)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
