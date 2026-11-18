import type { AdminUser, UserWardrobe } from '@/types';
import { request } from './client';

export function listUsers() {
  return request<{ users: AdminUser[] }>('/admin/users');
}

export function deleteUser(id: string) {
  return request<{ message: string }>(`/admin/users/${id}`, { method: 'DELETE' });
}

// Prendas y outfits de un usuario, en solo lectura. Solo administradores.
export function getUserWardrobe(id: string) {
  return request<UserWardrobe>(`/admin/users/${id}/wardrobe`);
}