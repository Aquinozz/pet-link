import { useCallback, useState, type ReactNode } from 'react'
import { jwtDecode } from 'jwt-decode'
import type { AuthUser, UserRole } from '../types'
import { AuthContext } from './useAuth'

interface JwtPayload {
  sub: string
  roles?: string[]
  role?: string
  iat: number
  exp: number
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('zoop_token'))
  const [user, setUser] = useState<AuthUser | null>(() => {
    const t = localStorage.getItem('zoop_token')
    return t ? parseToken(t) : null
  })
  const [tutorId, setTutorIdState] = useState<number | null>(() => {
    const id = localStorage.getItem('zoop_tutor_id')
    return id ? Number(id) : null
  })
  const [prestadorId, setPrestadorIdState] = useState<number | null>(() => {
    const id = localStorage.getItem('zoop_prestador_id')
    return id ? Number(id) : null
  })
  const [fotoUrl, setFotoUrlState] = useState<string | null>(() => localStorage.getItem('zoop_foto_url'))

  const signIn = useCallback((newToken: string) => {
    localStorage.setItem('zoop_token', newToken)
    setToken(newToken)
    setUser(parseToken(newToken))
  }, [])

  const setTutorId = useCallback((id: number) => {
    localStorage.setItem('zoop_tutor_id', String(id))
    setTutorIdState(id)
  }, [])

  const setPrestadorId = useCallback((id: number) => {
    localStorage.setItem('zoop_prestador_id', String(id))
    setPrestadorIdState(id)
  }, [])

  const setFotoUrl = useCallback((url: string | null) => {
    if (url) localStorage.setItem('zoop_foto_url', url)
    else localStorage.removeItem('zoop_foto_url')
    setFotoUrlState(url)
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('zoop_token')
    localStorage.removeItem('zoop_tutor_id')
    localStorage.removeItem('zoop_prestador_id')
    localStorage.removeItem('zoop_foto_url')
    setToken(null)
    setUser(null)
    setTutorIdState(null)
    setPrestadorIdState(null)
    setFotoUrlState(null)
  }, [])

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
