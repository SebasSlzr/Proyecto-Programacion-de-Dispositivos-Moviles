# Percha

Percha es un armario digital para Android hecho con React Native y Expo. La usuaria fotografía sus prendas, la app detecta su color y las cuelga en un clóset de madera; con ellas arma outfits por zonas del cuerpo o le pide a la app que sugiera uno por armonía de color. En la lista de deseos pega el link de una prenda que vio en una tienda o en Instagram, y antes de comprarla Percha le muestra con cuántos outfits de su armario combina (**regla de los 3 outfits**: si no arma al menos tres, tal vez no vale la pena comprarla).

Proyecto final del curso Programación de Dispositivos Móviles.

## Funcionalidades

**Rol usuario**

- Armario con fotos (cámara o galería), búsqueda, filtro por categoría y filtro por familia de color.
- Color dominante detectado en el servidor y corregible a mano.
- Outfits por zonas (cabeza, torso con varias capas, piernas y pies) con las fotos de sus prendas.
- "Sugerir outfit": combinación por armonía de color (neutra, complementaria o análoga) que se puede guardar.
- Lista de deseos: leer el link de una tienda (nombre, tienda, precio e imagen), editar, marcar como comprado, abrir el link y pasar la prenda al armario. En el detalle, los outfits que arma con lo que ya se tiene.
- Notificaciones: "Tu outfit de hoy" (local, a la hora que elige la usuaria) y recordatorio de deseos sin comprar (push desde el servidor).
- Perfil, sesión persistente y política de privacidad.

**Rol administrador**

- Panel de usuarios con estadísticas, búsqueda y secciones por rol.
- Armario de cada usuario (prendas y outfits) en solo lectura, declarado en la política de privacidad.
- Eliminar cuentas de usuario.

## Arquitectura

```
┌──────────────────────┐   HTTPS + JWT    ┌───────────────────────────┐
│  App Percha (APK)    │ ───────────────▶ │  API percha-backend       │
│  Expo SDK 58         │ ◀─────────────── │  Node + Express (Render)  │
│  React Native 0.88   │       JSON       └─────┬──────────┬──────────┘
└──────────┬───────────┘                        │          │
           │ fotos (subida firmada)             │          │
           ▼                                    ▼          ▼
┌──────────────────────┐              ┌────────────┐ ┌─────────────────────┐
│ Cloudinary           │ ◀─────────── │ MongoDB    │ │ Expo Push + FCM     │
│ (imágenes)           │   solo URLs  │ Atlas      │ │ (notificaciones)    │
└──────────────────────┘              └────────────┘ └─────────────────────┘
```

- **App (este repositorio):** muestra la interfaz y envía las intenciones; las reglas de negocio viven en el servidor.
- **API ([percha-backend](https://github.com/SebasSlzr/percha-backend)):** Express, Mongoose y JWT. Calcula el color dominante con `sharp`, lee los links de la wishlist con protección contra direcciones internas, valida roles y corre un job con `node-cron` que envía los recordatorios push.
- **Base de datos:** MongoDB Atlas. Las imágenes se guardan en Cloudinary y en la base solo va su URL.

### Stack de la app

| Tema | Tecnología |
|---|---|
| Base | Expo SDK 58, React Native 0.88, TypeScript estricto, React Compiler |
| Navegación | Expo Router (rutas por archivos, `typedRoutes`, `Stack.Protected` por rol) |
| Estilos | NativeWind 4 (Tailwind 3), tokens en `tailwind.config.js` y `src/constants/theme.ts` |
| Formularios | react-hook-form |
| Imágenes | `expo-image`, `expo-image-picker`, Cloudinary |
| Sesión | `expo-secure-store` (cierre automático ante 401) |
| Notificaciones | `expo-notifications` (locales y push con FCM) |
| Pruebas | Jest con `jest-expo` |

### Estructura del código

```
app/                 Solo rutas y layouts (cada archivo es una ruta de Expo Router)
src/screens/         Una carpeta por pantalla: <Pantalla>Screen.tsx (interfaz) + use<Algo>.ts (lógica)
src/components/      Componentes por tema: ui, garments, outfits, wishlist, admin, profile
src/api/             Llamadas al backend (un archivo por recurso)
src/notifications/   Canal, permisos, outfit del día, push y navegación al tocar
src/utils/           Funciones puras (color, sugerencias, iniciales) y sus pruebas
src/constants/       Tokens de color, textos (strings.ts), categorías
```

## Instalar el APK

1. Descarga `Percha-v1.0.apk` en un celular Android: *(enlace pendiente, se agrega con la entrega final)*.
2. Ábrelo y, si Android lo pide, permite instalar apps de origen desconocido para el navegador o el gestor de archivos.
3. Entra con una de las cuentas de prueba que están en el `LEEME.txt` de la entrega (hay una por rol).

El backend está en el plan gratuito de Render: si nadie lo usó en los últimos 15 minutos, la primera petición puede tardar cerca de un minuto. Para despertarlo, abre `<URL del backend>/api/health` en el navegador y espera la respuesta.

## Correr en desarrollo

Requisitos: Node.js LTS, Git y la app Expo Go en el celular (o un emulador Android).

```powershell
git clone https://github.com/SebasSlzr/Proyecto-Programacion-de-Dispositivos-Moviles.git
cd Proyecto-Programacion-de-Dispositivos-Moviles
npm install
copy .env.example .env
```

Edita `.env` y pon la URL del backend (ver la tabla de abajo). Luego:

```powershell
npx expo start -c
```

Escanea el código QR con Expo Go. Expo Go sirve para todo excepto las notificaciones push (en Android, Expo Go no las trae desde el SDK 53): esas se prueban en el development build o en el APK.

### Variables de entorno

| Variable | Para qué | Ejemplo |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | URL base de la API, terminada en `/api` | `https://<servicio>.onrender.com/api` |

- El archivo `.env` no se sube al repositorio; `.env.example` es la plantilla.
- Expo inserta las variables `EXPO_PUBLIC_*` en el código al compilar: nunca se pone un secreto ahí.
- Para usar un backend en tu computador con un celular físico, `localhost` no sirve: usa la IP del computador en la misma red WiFi (`ipconfig`) o una URL de ngrok.
- Las variables del backend (MongoDB, JWT, Cloudinary, Expo Push) están documentadas en su propio repositorio.

### Pruebas y verificación

```powershell
npx tsc --noEmit
```

```powershell
npm test
```

Las pruebas están en `src/utils/__tests__/` y cubren las funciones puras: familias de color, `sugerirOutfit`, `outfitsConPrenda` e iniciales de usuario.

### Generar el APK

El APK se genera con EAS usando el perfil `preview` de `eas.json`:

```powershell
npx eas-cli build --platform android --profile preview
```

## Enlaces

- Repositorio del backend: https://github.com/SebasSlzr/percha-backend
- APK `Percha-v1.0.apk`: *(pendiente)*
- Video de demostración: *(pendiente)*

## Integrantes

| Integrante | Usuario de GitHub | Responsabilidades principales |
|---|---|---|
| Sebastián Salazar | [SebasSlzr](https://github.com/SebasSlzr) | Backend, despliegue, notificaciones push, integración y APK |
| Andrés David Castrillón | [AndresCastril](https://github.com/AndresCastril) | `sugerirOutfit`, regla de los 3 outfits, notificaciones en la app, sesión |
| Daniel Alejandro Cuartas | [CannibalishToast](https://github.com/CannibalishToast) | Armario y outfits, filtro por color, panel del administrador, README y documento |
| Luisa María Arango | [luArango02](https://github.com/luArango02) | Wishlist con lectura de links, color corregible, diálogos propios, política de privacidad |

En el historial de Git algunos commits aparecen con el nombre configurado en cada computador (por ejemplo "Sebastian Salazar" y "SebasSlzr", o "Andres Castrillon" y "AndresCastril"): corresponden a la misma persona.
