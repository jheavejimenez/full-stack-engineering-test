import { AuthResponse, LoginCredentials, SignupCredentials } from '@/app/utils/types';
import { fetchWithAuth } from '@/app/services/api';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return fetchWithAuth("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  return fetchWithAuth("/auth/signup", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}