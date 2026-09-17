import { request } from './client';
import type { Garment } from '../types';

export type GarmentInput = {
  name: string;
  category: string;
  color: string;
  swatchColor: string;
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