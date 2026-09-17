import { request } from './client';
import type { Outfit } from '../types';

export type OutfitInput = {
  name: string;
  head: string | null;
  torso: string[];
  legs: string | null;
  feet: string | null;
};

export function listOutfits() {
  return request<{ outfits: Outfit[] }>('/outfits');
}

export function createOutfit(input: OutfitInput) {
  return request<{ outfit: Outfit }>('/outfits', { body: input });
}

export function updateOutfit(id: string, changes: Partial<OutfitInput>) {
  return request<{ outfit: Outfit }>(`/outfits/${id}`, { method: 'PUT', body: changes });
}

export function deleteOutfit(id: string) {
  return request<{ message: string }>(`/outfits/${id}`, { method: 'DELETE' });
}