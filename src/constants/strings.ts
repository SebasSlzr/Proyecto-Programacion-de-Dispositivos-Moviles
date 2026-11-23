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
  wardrobe: {                                                                                  // Daniel
    allColors: 'Todos los colores',
    emptyColor: 'No tienes prendas de este color',
    emptyColorDescription: 'Prueba con otro color o toca "Todos los colores".',
  },
  admin: { panel: 'Usuarios', userDetail: 'Armario del usuario' },                            // Daniel
  dialogs: { confirm: 'Confirmar', cancel: 'Cancelar', ok: 'Entendido' },                     // Daniel
  // Luisa
  wishlistScreens: {
    readLink: 'Leer link',
    readingLink: 'Leyendo…',
    linkLabel: 'Link de la prenda',
    linkPlaceholder: 'Pega el link de la tienda o de Instagram',
    linkHint: 'Leemos el nombre, la tienda, el precio y la foto para que no los escribas tú.',
    linkDone: 'Listo. Revisa los datos que encontramos y corrige lo que haga falta.',
    linkFailed: 'No pudimos leer ese link. Completa los datos y sube una captura de la publicación',
    purchased: 'Comprado',
    pending: 'Pendiente',
    markPurchased: 'Marcar como comprado',
    a11yPurchased: 'Comprado. Toca para marcarlo como pendiente',
    a11yPending: 'Pendiente. Toca para marcarlo como comprado',
    noStore: 'Tienda sin indicar',
    filterPending: 'Pendientes',
    filterPurchased: 'Comprados',
    filterAll: 'Todos',
    search: 'Buscar por nombre o tienda…',
    pendingOne: 'deseo pendiente',
    pendingMany: 'deseos pendientes',
    emptyTitle: 'Tu lista de deseos está vacía',
    emptyDescription: 'Toca "Agregar deseo" y pega el link de la prenda que te gustó.',
    noMatchTitle: 'Nada coincide',
    noMatchDescription: 'Prueba con otro filtro u otra búsqueda.',
  },
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
    // Regla de los 3 outfits (detalle de un deseo)
    wishMatches: {
      title: 'Con lo que ya tienes',
      worth: (n: number) => `Vale la pena: combina con ${n} outfits de tu armario`,
      think: (n: number) => `Piénsalo: con lo que tienes solo armas ${n} ${n === 1 ? 'outfit' : 'outfits'}`,
      none: 'No combina con tu armario actual',
      missingData: 'Agrega la categoría y una foto para analizarla',
      emptyWardrobe: 'Agrega prendas a tu armario para analizar esta compra',
      newBadge: 'Nueva',
      outfitLabel: (n: number) => `Outfit ${n}`,
    },
  },
  notifications: { settingsTitle: 'Recordatorios' },                                           // Castri
} as const;