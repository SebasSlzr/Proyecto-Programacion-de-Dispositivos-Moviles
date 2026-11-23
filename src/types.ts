export type UserRole = 'user' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  wishlistReminders: boolean;        // ¿recibe recordatorios push de la wishlist?
};

export type AdminUser = User & { garmentCount: number; outfitCount: number };

export type Garment = {
  id: string;
  name: string;
  category: string;
  color: string;                     // nombre en español ("Azul marino")
  swatchColor: string;               // hex de muestra: el detectado o el corregido por la usuaria
  imageUrl: string | null;
  imagePublicId: string | null;
  isFavorite: boolean;
  dominantColor: string | null;      // hex que detectó el servidor, o null si no tiene foto
};

export type Outfit = {
  id: string;
  name: string;
  head: Garment | null;
  torso: Garment[];
  legs: Garment | null;
  feet: Garment | null;
};

export type WishlistItem = {
  id: string;
  name: string;
  url: string | null;                // link de la tienda o de la publicación
  store: string | null;
  price: number | null;              // pesos colombianos
  category: string | null;           // una de CATEGORIES; la necesita la regla de los 3 outfits
  imageUrl: string | null;
  imagePublicId: string | null;
  dominantColor: string | null;      // lo detecta el servidor a partir de la imagen
  purchased: boolean;
  createdAt: string;                 // fecha ISO
};

// Lo que el servidor logró leer de un link (la imagen ya quedó subida a Cloudinary).
export type WishlistPreview = {
  name: string | null;
  store: string | null;
  price: number | null;
  category: string | null;
  imageUrl: string | null;
  imagePublicId: string | null;
};

export type UserWardrobe = { user: AdminUser; garments: Garment[]; outfits: Outfit[] };