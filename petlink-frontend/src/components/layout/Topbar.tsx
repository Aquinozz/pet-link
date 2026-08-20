import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../../contexts/useAuth'
import { API_URL } from '../../api/axiosInstance'
import { Avatar } from '../ui/Avatar'
import { colors, radius, shadow } from '../../theme/tokens'

export default function Topbar() {
  const { user, fotoUrl, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const username = user?.email?.split('@')[0] ?? ''

  const handleLogout = () => {
    setOpen(false)
    signOut()
    navigate('/login')
  }

  return (
    <header
      style={{
        height: 64,
        backgroundColor: colors.white,
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 32px',
        flexShrink: 0,
      }}
    >
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          onClick={() => setOpen(o => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 10px',
            borderRadius: radius.md,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <Avatar name={username} src={fotoUrl ? `${API_URL}${fotoUrl}` : undefined} size={32} />
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: colors.gray[900], lineHeight: 1.1 }}>{username}</p>
            <p style={{ fontSize: 11, color: colors.gray[400], lineHeight: 1.2 }}>{user?.role === 'ROLE_PROFISSIONAL' ? 'Prestador' : 'Tutor'}</p>
          </div>
          <ChevronDown size={16} color={colors.gray[400]} />
        </button>

        {open && (
          <div
            role="menu"
            style={{
              position: 'absolute',
              right: 0,
              top: 'calc(100% + 8px)',
              minWidth: 200,
              backgroundColor: colors.white,
              borderRadius: radius.lg,
              border: `1px solid ${colors.border}`,
              boxShadow: shadow.md,
              padding: 6,
              zIndex: 50,
            }}
          >
            <p style={{ fontSize: 12, color: colors.gray[400], padding: '8px 10px', wordBreak: 'break-all' }}>{user?.email}</p>
            <button
              onClick={handleLogout}
              role="menuitem"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 10px',
                borderRadius: radius.md,
                border: 'none',
                background: 'transparent',
                fontSize: 13,
                fontWeight: 500,
                color: colors.gray[700],
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <LogOut size={15} /> Sair
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
