// Textos estándar de la interfaz: nombres de pestañas, títulos y acciones.
// Si cambia un texto, se cambia aquí y se actualiza en toda la app.
export const STRINGS = {
  tabs: { wardrobe: 'Armario', outfits: 'Outfits', wishlist: 'Deseos', users: 'Usuarios' },
  titles: {
    wardrobe: 'Tu armario',
    outfits: 'Outfits',
    newGarment: 'Nueva prenda',
    editGarment: 'Editar prenda',
    profile: 'Tu perfil',
    login: 'Bienvenida de vuelta',
    register: 'Crea tu armario',
    wishlist: 'Lista de deseos',
    newWish: 'Nuevo deseo',
    editWish: 'Editar deseo',
  },
  actions: {
    addGarment: 'Agregar prenda',
    addOutfit: 'Agregar outfit',
    save: 'Guardar cambios',
    takePhoto: 'Tomar foto',
    gallery: 'Galería',
    removePhoto: 'Quitar foto',
    signOut: 'Cerrar sesión',
    addWish: 'Agregar deseo',
    suggestOutfit: 'Sugerir outfit',
    anotherSuggestion: 'Otra sugerencia',
  },
  messages: { noChanges: 'No hiciste ningún cambio' },
} as const;