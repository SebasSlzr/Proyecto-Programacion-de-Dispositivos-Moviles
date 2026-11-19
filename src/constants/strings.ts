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
    // Bloques por persona: cada quien agrega claves SOLO dentro del suyo (así no chocan las ramas).
  wardrobe: { allColors: 'Todos los colores', emptyColor: 'No tienes prendas de este color' }, // Daniel
  admin: { panel: 'Usuarios', userDetail: 'Armario del usuario' },                            // Daniel
  dialogs: { confirm: 'Confirmar', cancel: 'Cancelar', ok: 'Entendido' },                     // Daniel
  wishlistScreens: { readLink: 'Leer link' },                                                  // Luisa
  privacy: { title: 'Política de privacidad' },                                                // Luisa
  outfits: {                                                                                   // Castri
    suggest: 'Sugerir outfit',
    anotherSuggestion: 'Otra sugerencia',
    cannotSuggest: 'Para sugerir un outfit necesitas al menos una prenda de torso y una de piernas, o un vestido.',
    dismissSuggestion: 'Cerrar explicación',
    suggestionNames: {
      complementario: 'Combinación complementaria',
      analogo: 'Combinación análoga',
      neutro: 'Combinación neutra',
    },
    suggestionReasons: {
      complementario: 'Colores opuestos en la rueda de color: se resaltan entre sí.',
      analogo: 'Colores vecinos en la rueda de color: una combinación suave.',
      neutro: 'Tonos neutros: combinan con todo.',
    },
  },
  notifications: { settingsTitle: 'Recordatorios' },                                           // Castri
} as const;