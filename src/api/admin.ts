import type { AdminUser } from '@/types';
import { request } from './client';

export function listUsers() {
  return request<{ users: AdminUser[] }>('/admin/users');
}

export function deleteUser(id: string) {
  return request<{ message: string }>(`/admin/users/${id}`, { method: 'DELETE' });
}

