import { createContext, useContext, useState, type ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import type { AuthUser, UserRole } from '../types'

interface JwtPayload {
  sub: string
  roles?: string[]
  role?: string
  iat: number
  exp: number
}

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

function parseToken(token: string): AuthUser | null {
  try {
    const payload = jwtDecode<JwtPayload>(token)
    const roles: string[] = payload.roles ?? (payload.role ? [payload.role] : [])
    const role = roles[0] as UserRole
    return { email: payload.sub, role }
  } catch {
    return null
  }
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('petlink_token'))
  const [user, setUser] = useState<AuthUser | null>(() => {
    const t = localStorage.getItem('petlink_token')
    return t ? parseToken(t) : null
  })
  const [tutorId, setTutorIdState] = useState<number | null>(() => {
    const id = localStorage.getItem('petlink_tutor_id')
    return id ? Number(id) : null
  })
  const [prestadorId, setPrestadorIdState] = useState<number | null>(() => {
    const id = localStorage.getItem('petlink_prestador_id')
    return id ? Number(id) : null
  })
  const [fotoUrl, setFotoUrlState] = useState<string | null>(() => localStorage.getItem('petlink_foto_url'))

  const signIn = (newToken: string) => {
    localStorage.setItem('petlink_token', newToken)
    setToken(newToken)
    setUser(parseToken(newToken))
  }

  const setTutorId = (id: number) => {
    localStorage.setItem('petlink_tutor_id', String(id))
    setTutorIdState(id)
  }

  const setPrestadorId = (id: number) => {
    localStorage.setItem('petlink_prestador_id', String(id))
    setPrestadorIdState(id)
  }

  const setFotoUrl = (url: string | null) => {
    if (url) localStorage.setItem('petlink_foto_url', url)
    else localStorage.removeItem('petlink_foto_url')
    setFotoUrlState(url)
  }

  const signOut = () => {
    localStorage.removeItem('petlink_token')
    localStorage.removeItem('petlink_tutor_id')
    localStorage.removeItem('petlink_prestador_id')
    localStorage.removeItem('petlink_foto_url')
    setToken(null)
    setUser(null)
    setTutorIdState(null)
    setPrestadorIdState(null)
    setFotoUrlState(null)
  }

  return (
    <AuthContext.Provider value={{
      user, token, isAuthenticated: !!token,
      tutorId, prestadorId, fotoUrl,
      signIn, signOut,
      setTutorId, setPrestadorId, setFotoUrl,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
