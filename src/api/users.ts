import { request } from './client';
import type { User } from '../types';

export type UserUpdateInput = {
  name?: string;
  email?: string;
  password?: string;
};

export function updateMe(changes: UserUpdateInput) {
  return request<{ user: User }>('/users/me', { method: 'PUT', body: changes });
}

export function deleteMe() {
  return request<{ message: string }>('/users/me', { method: 'DELETE' });
}