import { useApiClient } from "~/composables/useApiClient";
import type { User } from "~/types/user";

interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

export const useAuthService = () => {
  const api = useApiClient();

  const login = (payload: LoginRequest) =>
    api.post<LoginRequest, AuthResponse>("/auth/login", payload);

  const register = (payload: RegisterRequest) =>
    api.post<RegisterRequest, AuthResponse>("/auth/register", payload);

  const fetchUserProfile = (): Promise<User> => api.get("/api/profile");

  const updateUserProfile = (payload: FormData): Promise<User> =>
    api.patch<FormData, User>("/api/profile", payload);

  return { login, register, fetchUserProfile, updateUserProfile };
};
