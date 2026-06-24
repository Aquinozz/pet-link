import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { authService } from '../api/authService'
import LandingPage from '../pages/public/LandingPage'
import LoginPage from '../pages/public/LoginPage'
import CadastroPage from '../pages/public/CadastroPage'
import DashboardTutor from '../pages/tutor/DashboardTutor'
import MeusPets from '../pages/tutor/MeusPets'
import Prestadores from '../pages/tutor/Prestadores'
import Agendamentos from '../pages/tutor/Agendamentos'
import Avaliacoes from '../pages/tutor/Avaliacoes'
import DashboardPrestador from '../pages/prestador/DashboardPrestador'
import MeuPerfil from '../pages/prestador/MeuPerfil'

function RoleRoute({ children, roles }: { children: React.ReactNode; roles: string[] }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user && !roles.includes(user.role)) return <Navigate to="/login" replace />
  return <>{children}</>
}

function RedirectByRole() {
  const { user, isAuthenticated, setTutorId, setPrestadorId } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    const navigateByRole = () => {
      if (user?.role === 'ROLE_PROFISSIONAL') navigate('/prestador/dashboard')
      else if (user?.role === 'ROLE_ADMIN') navigate('/admin/dashboard')
      else navigate('/tutor/dashboard')
    }

    authService.me().then(me => {
      if (me.id) {
        if (user?.role === 'ROLE_TUTOR') setTutorId(me.id)
        if (user?.role === 'ROLE_PROFISSIONAL' && me.prestadorModelId) setPrestadorId(me.prestadorModelId)
      }
      navigateByRole()
    }).catch(() => {
      navigateByRole()
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: '#6b7280' }}>Carregando...</p>
    </div>
  )
  return null
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/redirect" element={<RedirectByRole />} />

        <Route path="/tutor/dashboard" element={<RoleRoute roles={['ROLE_TUTOR']}><DashboardTutor /></RoleRoute>} />
        <Route path="/tutor/pets" element={<RoleRoute roles={['ROLE_TUTOR']}><MeusPets /></RoleRoute>} />
        <Route path="/tutor/prestadores" element={<RoleRoute roles={['ROLE_TUTOR']}><Prestadores /></RoleRoute>} />
        <Route path="/tutor/agendamentos" element={<RoleRoute roles={['ROLE_TUTOR']}><Agendamentos /></RoleRoute>} />
        <Route path="/tutor/avaliacoes" element={<RoleRoute roles={['ROLE_TUTOR']}><Avaliacoes /></RoleRoute>} />

        <Route path="/prestador/dashboard" element={<RoleRoute roles={['ROLE_PROFISSIONAL']}><DashboardPrestador /></RoleRoute>} />
        <Route path="/prestador/perfil" element={<RoleRoute roles={['ROLE_PROFISSIONAL']}><MeuPerfil /></RoleRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
