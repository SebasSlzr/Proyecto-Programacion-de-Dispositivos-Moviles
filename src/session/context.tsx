// Contexto de sesión: quién está usando el armario en este momento.
import { createContext, use, useState, type PropsWithChildren } from 'react';
import { request, setToken } from '../api/client';
import type { User } from '../types';

interface Session {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  // Actualiza el usuario en memoria después de editar el perfil, sin
  // necesidad de pedir login otra vez.
  updateUser: (user: User) => void;
}

interface SessionResponse {
  token: string;
  user: User;
}

const SessionContext = createContext<Session | null>(null);

export function useSession(): Session {
  const value = use(SessionContext);
  if (!value) throw new Error('useSession debe usarse dentro de <SessionProvider />');
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    const session = await request<SessionResponse>('/auth/login', {
      body: { email: email.trim().toLowerCase(), password },
    });
    setToken(session.token);
    setUser(session.user);
  };

  return (
    <SessionContext
      value={{
        user,
        signIn,
        signUp: async (name, email, password) => {
          await request<User>('/auth/register', {
            body: { name: name.trim(), email: email.trim().toLowerCase(), password },
          });
          await signIn(email, password);
        },
        signOut: () => {
          setToken(null);
          setUser(null);
        },
        updateUser: (updatedUser) => setUser(updatedUser),
      }}
    >
      {children}
    </SessionContext>
  );
}