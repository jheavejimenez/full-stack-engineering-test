import { AuthResponse, LoginCredentials, SignupCredentials } from '@/app/services/types';
import { fetchWithAuth } from '@/app/services/api';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if(!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
}

export async function signup(credentials: SignupCredentials): Promise<AuthResponse> {
  const response = await fetchWithAuth('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  if(!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
}
