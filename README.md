# Percha

App de armario digital hecha en React Native (Expo) — cataloga tus prendas, arma outfits combinando prendas por zona (cabeza, torso, piernas, pies), y administra tu cuenta. Conectada a un backend propio en Node/Express + MongoDB.

## Backend

El backend vive en un repositorio aparte: https://github.com/SebasSlzr/percha-backend

```powershell
git clone https://github.com/SebasSlzr/percha-backend.git
cd percha-backend
docker compose up -d
```

Las variables de entorno del backend ya están definidas en su `docker-compose.yml` (no requiere `.env` aparte):
- `MONGO_URI`
- `JWT_SECRET`
- `PORT`

## App móvil (este repositorio)

```powershell
npm install
npx expo start
```

Requiere un archivo `.env` en la raíz (no se sube al repositorio — cada quien pone su propia IP):

EXPO_PUBLIC_API_URL=http://TU_IP_LOCAL:4000/api

Usa la IP de tu PC en la red WiFi (`ipconfig` en Windows), en la misma red en la que esté el celular con Expo Go.

## Entidades con CRUD

- **Prenda**: catálogo de ropa del usuario — crear, buscar/filtrar por categoría, editar, eliminar.
- **Outfit**: combinaciones de prendas por cabeza, torso (varias capas), piernas y pies — crear, buscar por nombre, editar, eliminar.
- **Usuario**: perfil propio — ver, editar (nombre, correo, contraseña), eliminar cuenta.