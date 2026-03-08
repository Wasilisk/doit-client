import { useApiClient } from '~/composables/useApiClient'

interface RegisterRequest {
    email: string
    full_name: string
    password: string
}

interface LoginRequest {
    email: string
    password: string
}

interface AuthResponse {
    accessToken: string
}

export const useAuthService = () => {
    const api = useApiClient()

    const login = (payload: LoginRequest) =>
        api.post<LoginRequest, AuthResponse>('/auth/login', payload)

    const register = (payload: RegisterRequest) =>
        api.post<RegisterRequest, AuthResponse>('/auth/register', payload)

    return { login, register }
}