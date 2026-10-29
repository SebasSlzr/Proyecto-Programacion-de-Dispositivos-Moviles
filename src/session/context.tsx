// Contexto de sesión: quién está usando el armario en este momento.
// Además guarda el token en SecureStore para que la sesión siga abierta
// después de cerrar y volver a abrir la app.
import * as SecureStore from 'expo-secure-store';
import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';
import { Platform } from 'react-native';
import { request, setToken, setUnauthorizedHandler } from '../api/client';
import type { User } from '../types';

interface Session {
  user: User | null;
  // true mientras se revisa si había una sesión guardada (al abrir la app).
  isRestoring: boolean;
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

// SecureStore solo acepta letras, números, ".", "-" y "_" en las claves.
const TOKEN_KEY = 'percha_token';

// SecureStore usa el almacenamiento cifrado del celular (Keychain en iOS,
// Keystore en Android). En web no existe: ahí la sesión simplemente no persiste.
const canPersist = Platform.OS !== 'web';

function saveToken(token: string) {
  if (canPersist) return SecureStore.setItemAsync(TOKEN_KEY, token);
}

function readToken() {
  return canPersist ? SecureStore.getItemAsync(TOKEN_KEY) : Promise.resolve(null);
}

function clearToken() {
  if (canPersist) return SecureStore.deleteItemAsync(TOKEN_KEY);
}

const SessionContext = createContext<Session | null>(null);

export function useSession(): Session {
  const value = use(SessionContext);
  if (!value) throw new Error('useSession debe usarse dentro de <SessionProvider />');
  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);

  // Al abrir la app: si hay un token guardado, se le pide el usuario al
  // backend. Así el nombre y el rol siempre vienen actualizados, y si el
  // token venció (o es inválido) se borra y la persona va al login.

  useEffect(() => {
  setUnauthorizedHandler(() => {
    clearToken(); 
    setToken(null);
    setUser(null);
  });
  return () => setUnauthorizedHandler(null);
}, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await readToken();
        if (!token) return;

        setToken(token);
        const { user: savedUser } = await request<{ user: User }>('/auth/me');
        setUser(savedUser);
      } catch {
        setToken(null);
        await clearToken()?.catch(() => {});
      } finally {
        setIsRestoring(false);
      }
    };

    restoreSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    const session = await request<SessionResponse>('/auth/login', {
      body: { email: email.trim().toLowerCase(), password },
    });
    setToken(session.token);
    // Si guardarlo fallara, la persona igual entra; solo no quedaría recordada.
    await saveToken(session.token)?.catch(() => {});
    setUser(session.user);
  };

  return (
    <SessionContext
      value={{
        user,
        isRestoring,
        signIn,
        signUp: async (name, email, password) => {
          await request<User>('/auth/register', {
            body: { name: name.trim(), email: email.trim().toLowerCase(), password },
          });
          await signIn(email, password);
        },
        // También lo usa "Eliminar cuenta", así que ahí también se borra el token.
        signOut: () => {
          setToken(null);
          setUser(null);
          clearToken()?.catch(() => {});
        },
        updateUser: (updatedUser) => setUser(updatedUser),
      }}
    >
      {children}
    </SessionContext>
  );
}
