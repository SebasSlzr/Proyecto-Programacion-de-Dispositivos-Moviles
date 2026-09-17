export type User = {
  id: string;
  name: string;
  email: string;
};

export type Garment = {
  id: string;
  name: string;
  category: string;
  color: string;
  swatchColor: string;
};

export type Outfit = {
  id: string;
  name: string;
  head: Garment | null;
  torso: Garment[];
  legs: Garment | null;
  feet: Garment | null;
};