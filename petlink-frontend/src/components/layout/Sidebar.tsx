import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { BrandLogo } from '../BrandLogo'
import { Calendar, LayoutDashboard, PawPrint, Search, Settings, Star } from 'lucide-react'
import { colors, radius } from '../../theme/tokens'

const menuTutor = [
  { path: '/tutor/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} /> },
  { path: '/tutor/pets', label: 'Meus Pets', icon: <PawPrint size={18} strokeWidth={2} /> },
  { path: '/tutor/prestadores', label: 'Prestadores', icon: <Search size={18} strokeWidth={2} /> },
  { path: '/tutor/agendamentos', label: 'Agendamentos', icon: <Calendar size={18} strokeWidth={2} /> },
  { path: '/tutor/avaliacoes', label: 'Avaliações', icon: <Star size={18} strokeWidth={2} /> },
]

const menuPrestador = [
  { path: '/prestador/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} /> },
  { path: '/prestador/perfil', label: 'Meu Perfil', icon: <Settings size={18} strokeWidth={2} /> },
]

export default function Sidebar() {
  const { user } = useAuth()
  const location = useLocation()
  const menu = user?.role === 'ROLE_PROFISSIONAL' ? menuPrestador : menuTutor

  return (
    <aside
      style={{
        width: 232,
        minHeight: '100vh',
        backgroundColor: colors.white,
        borderRight: `1px solid ${colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 0',
        flexShrink: 0,
      }}
    >
      <div style={{ padding: '0 20px 24px', borderBottom: `1px solid ${colors.border}` }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <BrandLogo size={26} />
        </Link>
      </div>

      <div style={{ padding: '20px 12px', flex: 1 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: colors.gray[400],
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            padding: '0 10px',
            marginBottom: 8,
          }}
        >
          Menu
        </p>
        {menu.map(item => {
          const active = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: radius.md,
                marginBottom: 2,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: active ? 600 : 500,
                color: active ? colors.brand[900] : colors.gray[500],
                backgroundColor: active ? colors.brand[100] : 'transparent',
                transition: 'background-color 0.15s ease, color 0.15s ease',
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </div>

      <div style={{ padding: '16px 20px', borderTop: `1px solid ${colors.border}` }}>
        <div
          style={{
            backgroundColor: colors.brand[50],
            borderRadius: radius.lg,
            padding: '12px 14px',
            border: `1px solid ${colors.border}`,
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, color: colors.brand[900] }}>
            {user?.role === 'ROLE_PROFISSIONAL' ? 'Conta Prestador' : 'Conta Tutor'}
          </p>
          <p style={{ fontSize: 11, color: colors.gray[500], marginTop: 2 }}>{user?.email}</p>
        </div>
      </div>
    </aside>
  )
}
