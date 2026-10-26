import type { Garment } from '@/types';
import { request } from './client';

export type GarmentInput = {
  name: string;
  category: string;
  color: string;
  swatchColor: string;
  imageUrl?: string | null;
  imagePublicId?: string | null;
};

export function listGarments() {
  return request<{ garments: Garment[] }>('/garments');
}

export function createGarment(input: GarmentInput) {
  return request<{ garment: Garment }>('/garments', { body: input });
}

export function updateGarment(id: string, changes: Partial<GarmentInput>) {
  return request<{ garment: Garment }>(`/garments/${id}`, { method: 'PUT', body: changes });
}

export function deleteGarment(id: string) {
  return request<{ message: string }>(`/garments/${id}`, { method: 'DELETE' });
}

export function setGarmentFavorite(id: string, isFavorite: boolean) {
  return request<{ garment: Garment }>(`/garments/${id}/favorite`, { method: 'PATCH', body: { isFavorite } });
}