export type UserRole = 'user' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AdminUser = User & {
  garmentCount: number;
  outfitCount: number;
};

export type Garment = {
  id: string;
  name: string;
  category: string;
  color: string;
  swatchColor: string;          // color de muestra: respaldo cuando no hay foto
  imageUrl: string | null;      // URL de Cloudinary, o null si no tiene foto
  imagePublicId: string | null; // identificador en Cloudinary, o null
  isFavorite: boolean;
};

export type Outfit = {
  id: string;
  name: string;
  head: Garment | null;
  torso: Garment[];
  legs: Garment | null;
  feet: Garment | null;
};