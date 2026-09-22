# Diccionario de estilos — Percha

Este documento reúne el sistema visual que ya está implementado en el proyecto:
paleta de colores, tipografía, comportamiento de los componentes interactivos
y las reglas de cómo se aplican en cada tipo de elemento de la interfaz.

## Paleta de colores

| Nombre  | Valor hex | Uso |
|---------|-----------|-----|
| linen   | `#EAE4D9` | Fondo principal de todas las pantallas |
| ivory   | `#FBF9F5` | Tarjetas, campos de formulario, superficies elevadas |
| ink     | `#2B2621` | Texto principal en todas sus variantes de opacidad |
| plum    | `#5B3350` | Acento principal: botones, elementos activos, enlaces |
| sage    | `#7C8B6F` | Acento secundario: etiquetas, mensajes de confirmación |
| taupe   | `#D8CFC0` | Bordes, divisores, estado inactivo |

Estos seis colores están definidos en `tailwind.config.js` bajo
`theme.extend.colors`, y duplicados en formato de constantes en
`src/constants/theme.ts` para los casos en los que NativeWind no aplica
directamente (el color de un ícono, por ejemplo).

El texto usa variaciones de opacidad sobre `ink` en vez de colores nuevos:
`text-ink` para texto principal, `text-ink/60` para texto secundario. El
mismo patrón se usa con `sage` y `plum` para fondos suaves de etiquetas:
`bg-sage/20`, `bg-plum/10`.

### Color de estado (error y confirmación)

Los mensajes de error usan la escala roja por defecto de Tailwind, no un
color propio de la marca: fondo `bg-red-50`, texto `text-red-500`, y borde
`border-red-300` o `border-red-400` según el elemento. Los mensajes de
confirmación reutilizan `sage`: fondo `bg-sage/10`, texto `text-sage`. No hay
un color de advertencia (amarillo) definido todavía; no se ha necesitado.

## Tipografía

Dos familias tipográficas, cargadas desde Google Fonts vía
`@expo-google-fonts`:

**Fraunces** — serif editorial, para títulos. Se usan dos pesos:
- `Fraunces_600SemiBold` → clase `font-display`, para títulos de pantalla
- `Fraunces_400Regular` → clase `font-display-light`, sin uso activo por
  ahora, reservada para títulos que necesiten menos peso visual

**Manrope** — sans-serif, para todo el contenido funcional. Tres pesos:
- `Manrope_400Regular` → clase `font-body`, texto normal
- `Manrope_500Medium` → clase `font-body-medium`, etiquetas y campos
- `Manrope_700Bold` → clase `font-body-bold`, títulos de tarjetas y texto
  de botones

Los nombres de las clases (`font-display`, `font-body-medium`, etc.) se
definen en `tailwind.config.js` y no coinciden con los nombres de peso
normales de Tailwind (`font-medium`, `font-bold`) a propósito, para que no
haya conflicto entre la utilidad de peso de fuente que trae Tailwind por
defecto y las familias tipográficas propias del proyecto.

### Escala de tamaños en uso

| Tamaño | Dónde se usa |
|--------|--------------|
| `text-3xl` | Título de pantalla (`ScreenHeader`) |
| `text-xl`  | Título de un estado vacío |
| `text-base`| Texto de botones |
| `text-sm`  | Subtítulos, etiquetas de campo, nombre de chip, nombre de prenda |
| `text-xs`  | Texto secundario, contenido de badges |

## Radios, sombras y espaciado

- Tarjetas (prendas, outfits): `rounded-2xl`, con `shadow-sm` para dar
  sensación de foto flotando sobre el fondo.
- Botones, chips y campos con forma de píldora: `rounded-full`.
- Círculos de selección de color: `rounded-full` con `borderWidth`
  variable (1 en reposo, 3 al estar seleccionado) en vez de un cambio de
  color de fondo, para no alterar el color real que se está mostrando.
- Padding interno estándar en campos y botones: `px-4 py-3`.
- Separación entre bloques de un formulario: `gap-4` a `gap-6` según la
  densidad de la pantalla.

## Comportamientos e interacción

**Chip (selector de píldora)**: en reposo tiene fondo `ivory`, borde
`taupe` y texto `ink`. Al seleccionarse, cambia a fondo `plum`, borde
`plum` y texto `ivory`. Es el mismo cambio de estado en los tres lugares
donde se usa: filtro de categoría en el Armario, selección de categoría
en el formulario de prenda, y cualquier otro selector de una sola opción.

**Botón**: el cambio de estado no es de color, es de opacidad. Mientras se
mantiene presionado, la opacidad baja a 0.85 como retroalimentación
táctil. Cuando está deshabilitado — por ejemplo mientras se envía un
formulario — la opacidad baja a 0.5 y deja de responder al toque. El
texto también cambia durante el envío: "Guardar prenda" pasa a
"Guardando…" hasta que el servidor responde.

**Círculo de color (selector de muestra en el formulario de prenda y en
el selector de prendas de un outfit)**: en reposo tiene un borde de 1px
en `taupe`. Al seleccionarse, el borde se engruesa a 3px y cambia a
`plum`. El color de fondo del círculo nunca cambia — es el color real que
se está eligiendo, así que alterarlo generaría confusión.

**Selector de prenda para un outfit, en modo múltiple (Torso)**: además
del cambio de borde, cada prenda seleccionada muestra un número pequeño
en la esquina (1, 2, 3…) que indica el orden en que se van a apilar. Ese
número solo aparece en las zonas que permiten más de una prenda.

**Campo de formulario**: borde `taupe` en estado normal. Cambia a borde
rojo en cuanto el campo tiene un error de validación activo, junto con un
texto de error debajo. Vuelve a `taupe` apenas el valor pasa la
validación.

**Pestañas de navegación**: el ícono y el texto de la pestaña activa
toman el color `plum`; las inactivas quedan en `taupe`. Es el único lugar
de la interfaz donde `taupe` se usa como color de texto y no solo como
borde.

**Tarjetas (prenda u outfit)**: no tienen un estado de "seleccionado"
persistente. Se comportan como un botón de una sola acción — tocar la
tarjeta abre su pantalla de edición, y no queda marcada como activa
después.

## Estandarización de componentes

| Componente | Forma | Tamaño | Funcionalidad |
|---|---|---|---|
| Botón primario | Píldora (`rounded-full`) | Padding `py-3 px-6`, texto `text-base` | Acción principal de la pantalla, una sola por formulario |
| Botón secundario | Píldora con borde de 1px | Igual que el primario | Acción alternativa o de menor prioridad (cerrar sesión, cancelar) |
| Botón flotante (+) | Círculo | `44x44` | Crear un elemento nuevo, fijo en la esquina superior derecha del encabezado |
| Chip | Píldora con borde de 1px | Padding `px-4 py-2`, texto `text-sm` | Selección de una opción entre varias visibles al mismo tiempo |
| Badge | Píldora | Padding `px-2 py-0.5`, texto `text-xs` | Etiqueta informativa, no interactiva |
| Campo de texto | Rectángulo redondeado (`rounded-2xl`) | Padding `px-4 py-3` | Captura de texto en formularios, con validación asociada |
| Tarjeta (prenda u outfit) | Rectángulo redondeado (`rounded-2xl`) con sombra suave | Ancho aproximado del 47% en una grilla de dos columnas | Vista resumen de un elemento, tocable para abrir su edición |
| Círculo de color | Círculo | `40x40` en formularios, `64x64` en el selector de outfit | Selección de un color real; el borde indica si está elegido |

## Aplicación por tipo de elemento

**Contenedor de pantalla**: fondo `bg-linen`, padding `p-5` o `p-6` según
si el contenido es una lista o un formulario, con `paddingTop` adicional
para dejar espacio bajo el notch del dispositivo.

**Botones** (`Button.tsx`): la variante primaria usa fondo `plum` con
texto `ivory`; la secundaria usa fondo transparente con borde y texto
`plum`. Ambas comparten forma, tamaño de texto y el mismo manejo de
opacidad al presionar o al estar deshabilitado.

**Campos de formulario** (`FormField.tsx`): fondo `ivory`, borde `taupe`
en estado normal. La etiqueta va siempre arriba del campo, en
`font-body-medium text-sm`.

**Tarjetas de contenido** (`GarmentCard.tsx`, `OutfitCard.tsx`): fondo
`ivory`, esquinas `rounded-2xl`, una zona superior de color (la muestra
de la prenda) y una zona inferior con el nombre y las etiquetas.

**Etiquetas** (`Badge.tsx`): fondo suave (`bg-sage/20` o `bg-plum/10`)
con texto del mismo color en su versión sólida.

**Mensajes de error y confirmación**: bloque de ancho completo, fondo
suave del color correspondiente, texto centrado, esquinas `rounded-2xl`,
padding `p-3`. Aparecen siempre encima del botón de acción, nunca como
una alerta emergente aparte, salvo en las confirmaciones de eliminar, que
sí usan el diálogo nativo del sistema.

**Estados vacíos** (`EmptyState.tsx`): ícono dentro de un círculo `ivory`,
título en `font-display text-xl`, descripción en `font-body text-sm`
con opacidad reducida, todo centrado.

## Dónde vive esto en el código

- `tailwind.config.js` — la fuente de la verdad para colores y
  tipografías, en forma de clases de utilidad.
- `src/constants/theme.ts` — los mismos colores en hexadecimal, para los
  pocos casos donde no se puede usar `className`.
- `src/components/ui/` — todos los componentes de esta guía viven ahí,
  como implementación real de estas reglas, no solo como documentación.

## Fuera de alcance de este documento

Logotipo e identidad de marca completa (nombre definitivo, ícono de la
app, aplicaciones de marca fuera de la interfaz) quedan pendientes para
una entrega posterior.