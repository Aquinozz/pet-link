import { createContext, useContext } from 'react'
import type { AuthUser } from '../types'

export interface AuthContextData {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  tutorId: number | null
  prestadorId: number | null
  fotoUrl: string | null
  signIn: (token: string) => void
  signOut: () => void
  setTutorId: (id: number) => void
  setPrestadorId: (id: number) => void
  setFotoUrl: (url: string | null) => void
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const useAuth = () => useContext(AuthContext)
