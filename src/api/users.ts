import type { User } from '@/types';
import { request } from './client';

export type UserUpdateInput = {
  name?: string;
  email?: string;
  password?: string;
  wishlistReminders?: boolean;
};

export function updateMe(changes: UserUpdateInput) {
  return request<{ user: User }>('/users/me', { method: 'PUT', body: changes });
}

export function deleteMe() {
  return request<{ message: string }>('/users/me', { method: 'DELETE' });
}

// Asocia este teléfono a la cuenta de la sesión; null lo desvincula.
export function savePushToken(token: string | null) {
  return request<void>('/users/me/push-token', { method: 'PUT', body: { token } });
}