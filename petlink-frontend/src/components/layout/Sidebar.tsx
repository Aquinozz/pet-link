import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/useAuth'
import { BrandLogo } from '../BrandLogo'
import { Calendar, LayoutDashboard, PawPrint, Search, Settings, X } from 'lucide-react'
import { useIsTablet } from '../../hooks/useMediaQuery'
import { colors, radius, shadow, transition } from '../../theme/tokens'

const menuTutor = [
  { path: '/tutor/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} /> },
  { path: '/tutor/pets', label: 'Meus Pets', icon: <PawPrint size={18} strokeWidth={2} /> },
  { path: '/tutor/prestadores', label: 'Prestadores', icon: <Search size={18} strokeWidth={2} /> },
  { path: '/tutor/agendamentos', label: 'Agendamentos', icon: <Calendar size={18} strokeWidth={2} /> },
]

const menuPrestador = [
  { path: '/prestador/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} strokeWidth={2} /> },
  { path: '/prestador/perfil', label: 'Meu Perfil', icon: <Settings size={18} strokeWidth={2} /> },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export default function Sidebar({ open = true, onClose }: SidebarProps) {
  const { user } = useAuth()
  const location = useLocation()
  const isTablet = useIsTablet()
  const menu = user?.role === 'ROLE_PROFISSIONAL' ? menuPrestador : menuTutor

  useEffect(() => {
    if (isTablet) onClose?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <>
      {isTablet && open && (
        <div
          onClick={onClose}
          aria-hidden
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            zIndex: 190,
          }}
        />
      )}
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
          ...(isTablet ? {
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            minHeight: 'unset',
            zIndex: 200,
            transform: open ? 'translateX(0)' : 'translateX(-100%)',
            transition: 'transform 0.25s ease',
            boxShadow: open ? shadow.md : 'none',
          } : {}),
        }}
      >
        <div style={{ padding: '0 12px 24px', borderBottom: `1px solid ${colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <BrandLogo size={26} />
          </Link>
          {isTablet && (
            <button
              onClick={onClose}
              aria-label="Fechar menu"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 34, height: 34, borderRadius: radius.md,
                border: 'none', background: 'transparent', cursor: 'pointer', color: colors.gray[500],
              }}
            >
              <X size={19} />
            </button>
          )}
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
                aria-current={active ? 'page' : undefined}
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
                  color: active ? colors.brand[700] : colors.gray[500],
                  backgroundColor: active ? colors.brand[50] : 'transparent',
                  borderLeft: active ? `3px solid ${colors.brand[600]}` : '3px solid transparent',
                  transition,
                }}
              >
                <span style={{ color: active ? colors.brand[600] : colors.gray[400], display: 'flex' }}>{item.icon}</span>
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
    </>
  )
}
