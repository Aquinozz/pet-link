"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { TOKEN_KEY } from "./api";
import type { UserRole } from "./types";

export interface AuthUser {
  email: string;
  role: UserRole;
}

interface AuthContextData {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  tutorId: number | null;
  prestadorId: number | null;
  nome: string | null;
  fotoUrl: string | null;
  signIn: (token: string) => void;
  signOut: () => void;
  setTutorId: (id: number) => void;
  setPrestadorId: (id: number) => void;
  setNome: (nome: string) => void;
  setFotoUrl: (url: string | null) => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

function parseToken(token: string): AuthUser | null {
  try {
    const base64 = token.split(".")[1];
    const payload = JSON.parse(atob(base64));
    const role = (payload.roles?.[0] ?? payload.role) as UserRole;
    return { email: payload.sub, role };
  } catch {
    return null;
  }
}

function readStored(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => readStored(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = readStored(TOKEN_KEY);
    return stored ? parseToken(stored) : null;
  });
  const [tutorId, setTutorIdState] = useState<number | null>(() => {
    const stored = readStored("zoop_tutor_id");
    return stored ? Number(stored) : null;
  });
  const [prestadorId, setPrestadorIdState] = useState<number | null>(() => {
    const stored = readStored("zoop_prestador_id");
    return stored ? Number(stored) : null;
  });
  const [nome, setNomeState] = useState<string | null>(() => readStored("zoop_nome"));
  const [fotoUrl, setFotoUrlState] = useState<string | null>(() => readStored("zoop_foto_url"));

  const signIn = (newToken: string) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setUser(parseToken(newToken));
  };

  const signOut = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("zoop_tutor_id");
    localStorage.removeItem("zoop_prestador_id");
    localStorage.removeItem("zoop_nome");
    localStorage.removeItem("zoop_foto_url");
    setToken(null);
    setUser(null);
    setTutorIdState(null);
    setPrestadorIdState(null);
    setNomeState(null);
    setFotoUrlState(null);
  };

  const setTutorId = (id: number) => {
    localStorage.setItem("zoop_tutor_id", String(id));
    setTutorIdState(id);
  };
  const setPrestadorId = (id: number) => {
    localStorage.setItem("zoop_prestador_id", String(id));
    setPrestadorIdState(id);
  };
  const setNome = (value: string) => {
    localStorage.setItem("zoop_nome", value);
    setNomeState(value);
  };
  const setFotoUrl = (url: string | null) => {
    if (url) localStorage.setItem("zoop_foto_url", url);
    else localStorage.removeItem("zoop_foto_url");
    setFotoUrlState(url);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        tutorId,
        prestadorId,
        nome,
        fotoUrl,
        signIn,
        signOut,
        setTutorId,
        setPrestadorId,
        setNome,
        setFotoUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}