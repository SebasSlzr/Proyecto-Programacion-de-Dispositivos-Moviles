import { ModalHeader } from '@/components/ui/ModalHeader';

type ProfileHeaderProps = {
  onClose: () => void;
};

// Encabezado de madera del drawer de perfil. Reutiliza ModalHeader
// (el mismo encabezado de las pantallas de prenda) cambiando qué hace "Cerrar".
export function ProfileHeader({ onClose }: ProfileHeaderProps) {
  return <ModalHeader title="Tu perfil" subtitle="Administra tu cuenta" onClose={onClose} />;
}
