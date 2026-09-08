// Contexto de sesión: quién está usando el armario en este momento.
//
// Un "contexto" de React comparte un valor con todas las pantallas sin
// pasarlo a mano de una a otra. Aquí guardamos el usuario y exponemos las
// tres acciones que lo cambian: entrar, registrarse y salir. El layout raíz
// (`src/app/_layout.tsx`) usa `user` para decidir si mostrar el armario o
// las pantallas de login/registro.
//
// Los endpoints (/auth/login, /auth/register) se llaman directamente desde
// aquí: no hay una capa aparte que traduzca nombres de campo, porque tanto
// la app como el futuro backend van a hablar en inglés.

import { createContext, use, useState, type PropsWithChildren } from 'react';
import { request, setToken } from '../api/client';
import type { User } from '../types';

interface Session {
  /** null = nadie ha entrado. */
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

/** Forma en la que el backend responde a un login exitoso. */
interface SessionResponse {
  token: string;
  user: User;
}

const SessionContext = createContext<Session | null>(null);

/** Atajo para leer la sesión desde cualquier pantalla: `const { user } = useSession()`. */
export function useSession(): Session {
  const value = use(SessionContext);
  if (!value) throw new Error('useSession debe usarse dentro de <SessionProvider />');
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  // Pide el token al backend y lo deja disponible para las siguientes
  // peticiones. Si las credenciales son malas, `request` lanza el error del
  // servidor y la pantalla de login lo muestra: aquí no se atrapa.
  const signIn = async (email: string, password: string) => {
    const session = await request<SessionResponse>('/auth/login', {
      email: email.trim().toLowerCase(),
      password,
    });
    setToken(session.token);
    setUser(session.user);
  };

  return (
    <SessionContext
      value={{
        user,
        signIn,
        // El registro no devuelve token (solo crea el usuario), así que
        // enseguida iniciamos sesión con las mismas credenciales para que
        // la persona entre de una vez y no tenga que escribirlas dos veces.
        signUp: async (name, email, password) => {
          await request<User>('/auth/register', {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
          });
          await signIn(email, password);
        },
        signOut: () => {
          setToken(null);
          setUser(null);
        },
      }}
    >
      {children}
    </SessionContext>
  );
}
