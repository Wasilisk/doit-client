
import { defineStore } from 'pinia'

interface AuthState {
    token: string | null
}

export const useAuthStore = defineStore('auth', {
    state: (): AuthState => ({
        token: null,
    }),

    getters: {
        isAuthenticated: (state) => !!state.token
    },

    actions: {
        setToken(token: string) {
            this.token = token
            localStorage.setItem('auth_token', token)
        },

        loadFromStorage() {
            const token = localStorage.getItem('auth_token')
            if (token) this.token = token
        },

        logout() {
            this.token = null
            localStorage.removeItem('auth_token')
        }
    }
})