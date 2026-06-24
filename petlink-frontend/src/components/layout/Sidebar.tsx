import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const menuTutor = [
  { path: '/tutor/dashboard', label: 'Dashboard', icon: '📋' },
  { path: '/tutor/pets', label: 'Meus Pets', icon: '🐾' },
  { path: '/tutor/prestadores', label: 'Prestadores', icon: '🔍' },
  { path: '/tutor/agendamentos', label: 'Agendamentos', icon: '📅' },
  { path: '/tutor/avaliacoes', label: 'Avaliações', icon: '⭐' },
]

const menuPrestador = [
  { path: '/prestador/dashboard', label: 'Dashboard', icon: '📋' },
  { path: '/prestador/perfil', label: 'Meu Perfil', icon: '⚙️' },
]

export default function Sidebar() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const menu = user?.role === 'ROLE_PROFISSIONAL' ? menuPrestador : menuTutor

  const handleLogout = () => { signOut(); navigate('/login') }

  return (
    <aside style={{
      width: 240, minHeight: '100vh', backgroundColor: '#fff',
      borderRight: '1px solid #e5e7eb', display: 'flex',
      flexDirection: 'column', padding: '24px 0', flexShrink: 0,
    }}>
      <div style={{ padding: '0 24px 24px', borderBottom: '1px solid #f3f4f6' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
            Pet<span style={{ color: '#2563EB' }}>Link</span>
          </span>
        </Link>
      </div>

      <div style={{ padding: '16px 12px', flex: 1 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0 12px', marginBottom: 8 }}>
          {user?.role === 'ROLE_PROFISSIONAL' ? 'Prestador' : 'Tutor'}
        </p>
        {menu.map((item) => {
          const active = location.pathname === item.path
          return (
            <Link key={item.path} to={item.path} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
              borderRadius: 8, marginBottom: 2, textDecoration: 'none', fontSize: 14,
              fontWeight: active ? 600 : 400,
              color: active ? '#2563EB' : '#374151',
              backgroundColor: active ? '#eff6ff' : 'transparent',
            }}>
              <span>{item.icon}</span>{item.label}
            </Link>
          )
        })}
      </div>

      <div style={{ padding: '16px 24px', borderTop: '1px solid #f3f4f6' }}>
        <p style={{ fontSize: 13, color: '#374151', fontWeight: 600, marginBottom: 2 }}>
          {user?.email?.split('@')[0]}
        </p>
        <p style={{ fontSize: 11, color: '#9ca3af', marginBottom: 12 }}>{user?.email}</p>
        <button onClick={handleLogout} style={{
          width: '100%', padding: '8px 0', borderRadius: 8, border: '1px solid #e5e7eb',
          background: 'transparent', fontSize: 13, color: '#6b7280', cursor: 'pointer',
        }}>
          Sair
        </button>
      </div>
    </aside>
  )
}
