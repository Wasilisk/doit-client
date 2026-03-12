import { defineStore } from 'pinia'
import { useAuthService } from '~/services/auth.service'
import type { User } from '~/types/user'

interface AuthState {
    token: string | null
    user: User | null
    isFetchingUser: boolean
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: null,
        user: null,
        isFetchingUser: false,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        setToken(token: string) {
            this.token = token
            const cookie = useCookie('auth_token', {
                maxAge: 60 * 60 * 24 * 7, // 7 days
                sameSite: 'lax',
                secure: true,
            })
            cookie.value = token
        },

        loadFromStorage() {
            const cookie = useCookie('auth_token')
            if (cookie.value) this.token = cookie.value
        },

        logout() {
            this.token = null
            this.user = null
            const cookie = useCookie('auth_token')
            cookie.value = null
        },

        async fetchMe() {
            if (!this.token) return

            const authService = useAuthService()

            this.isFetchingUser = true

            try {
                this.user = await authService.fetchUserProfile()
            } catch (e) {
                console.error('Failed to fetch user profile:', e)
                this.logout()
            } finally {
                this.isFetchingUser = false
            }
        }
    }
})