import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authApi } from '../api/auth.api';
import { setAuthToken } from '../api/axiosClient';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: attempt silent refresh so the user stays logged in after a page reload.
  useEffect(() => {
    authApi.refresh()
      .then(({ data }) => {
        setAccessToken(data.accessToken);
        setAuthToken(data.accessToken);
        return authApi.me();
      })
      .then(({ data }) => setUser(data.user))
      .catch(() => {/* no session — stay logged out */})
      .finally(() => setIsLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { data } = await authApi.login(email, password);
    setAccessToken(data.accessToken);
    setAuthToken(data.accessToken);
    setUser(data.user);
  }

  async function register(email: string, username: string, password: string) {
    const { data } = await authApi.register(email, username, password);
    setAccessToken(data.accessToken);
    setAuthToken(data.accessToken);
    setUser(data.user);
  }

  async function logout() {
    await authApi.logout().catch(() => {});
    setAccessToken(null);
    setAuthToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
