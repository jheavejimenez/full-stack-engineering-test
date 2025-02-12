import { fetchWithAuth } from '@/app/services/api';
import { User } from '@/app/utils/types';

export async function getUsers(): Promise<User[]> {
  return fetchWithAuth("/users")
}

export async function getUser(id: string): Promise<User> {
  return fetchWithAuth(`/users/${id}`)
}
