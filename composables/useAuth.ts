import { ref } from 'vue'
import type { User, AuthResponse } from '~/types'

export const useAuth = () => {
    const user = ref<User | null>(null)
    const token = ref<string | null>(null)
    const isAuthenticated = computed(() => !!token.value)

    // Initialize from localStorage
    if (process.client) {
        token.value = localStorage.getItem('auth_token')
        const storedUser = localStorage.getItem('auth_user')
        if (storedUser) {
            try {
                user.value = JSON.parse(storedUser)
            } catch (e) {
                console.error('Failed to parse stored user:', e)
            }
        }
    }

    const register = async (email: string, password: string, name: string) => {
        try {
            const response = await $fetch<AuthResponse>('/api/auth/register', {
                method: 'POST',
                body: { email, password, name },
            })

            user.value = response.user
            token.value = response.token

            if (process.client) {
                localStorage.setItem('auth_token', response.token)
                localStorage.setItem('auth_user', JSON.stringify(response.user))
            }

            return response
        } catch (error: any) {
            throw new Error(error.data?.message || 'Registration failed')
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const response = await $fetch<AuthResponse>('/api/auth/login', {
                method: 'POST',
                body: { email, password },
            })

            user.value = response.user
            token.value = response.token

            if (process.client) {
                localStorage.setItem('auth_token', response.token)
                localStorage.setItem('auth_user', JSON.stringify(response.user))
            }

            return response
        } catch (error: any) {
            throw new Error(error.data?.message || 'Login failed')
        }
    }

    const logout = () => {
        user.value = null
        token.value = null

        if (process.client) {
            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
        }
    }

    const getAuthHeaders = () => {
        return token.value ? { Authorization: `Bearer ${token.value}` } : {}
    }

    return {
        user,
        token,
        isAuthenticated,
        register,
        login,
        logout,
        getAuthHeaders,
    }
}
