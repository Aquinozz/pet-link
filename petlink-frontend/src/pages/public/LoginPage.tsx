import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, MapPin, Heart, User, ShoppingCart, PawPrint, Briefcase } from 'lucide-react'
import { useAuth } from '../../contexts/useAuth'
import { authService } from '../../api/authService'
import { BrandLogo } from '../../components/BrandLogo'
import { Button } from '../../components/ui/Button'
import { AuthField } from '../../components/auth/AuthField'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { colors, radius, shadow, fontFamily } from '../../theme/tokens'
import { fieldLabel } from '../../components/ui/field'

type Perfil = 'tutor' | 'profissional'

function TopBar({ compact }: { compact: boolean }) {
  return (
    <header
      style={{
        backgroundColor: colors.brand[900],
        padding: compact ? '16px 20px' : '18px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
        <BrandLogo size={compact ? 24 : 28} colorText={colors.white} />
      </Link>
      {!compact && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <MapPin size={19} color={colors.brand[200]} />
          <Heart size={19} color={colors.brand[200]} />
          <User size={19} color={colors.brand[200]} />
          <ShoppingCart size={19} color={colors.brand[200]} />
          <span
            style={{
              backgroundColor: colors.brand[600],
              color: colors.white,
              fontSize: 13,
              fontWeight: 700,
              padding: '8px 20px',
              borderRadius: 999,
            }}
          >
            Entrar
          </span>
        </div>
      )}
    </header>
  )
}

function PerfilToggle({ value, onChange }: { value: Perfil; onChange: (p: Perfil) => void }) {
  const options: { key: Perfil; label: string; icon: React.ReactNode }[] = [
    { key: 'tutor', label: 'Sou tutor', icon: <PawPrint size={14} /> },
    { key: 'profissional', label: 'Sou profissional', icon: <Briefcase size={14} /> },
  ]

  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
      {options.map(opt => {
        const active = value === opt.key
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            style={{
              flex: '1 1 0',
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              padding: '11px 8px',
              borderRadius: radius.md,
              fontSize: 13,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
              border: `1.5px solid ${active ? colors.brand[600] : colors.gray[200]}`,
              backgroundColor: active ? colors.brand[50] : colors.white,
              color: active ? colors.brand[700] : colors.gray[500],
            }}
          >
            {opt.icon}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

function LoginForm() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [perfil, setPerfil] = useState<Perfil>('tutor')
  const [form, setForm] = useState({ email: '', senha: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authService.login(form)
      signIn(res.token)
      navigate('/redirect')
    } catch {
      setError('Email ou senha incorretos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: colors.gray[900], lineHeight: 1.2, marginBottom: 8, fontFamily: fontFamily.display }}>
        Entrar na Zoop
      </h1>
      <p style={{ fontSize: 14, color: colors.gray[500], lineHeight: 1.6, marginBottom: 26 }}>
        Acesse sua conta para cuidar de quem você ama.
      </p>

      <PerfilToggle value={perfil} onChange={setPerfil} />

      <form onSubmit={handleSubmit}>
        <label style={fieldLabel()}>E-mail</label>
        <AuthField
          icon={<Mail size={17} />}
          type="email"
          placeholder="seu@email.com"
          value={form.email}
          onChange={v => setForm(f => ({ ...f, email: v }))}
          autoComplete="email"
        />
        <label style={fieldLabel()}>Senha</label>
        <AuthField
          icon={<Lock size={17} />}
          type="password"
          placeholder="Sua senha"
          value={form.senha}
          onChange={v => setForm(f => ({ ...f, senha: v }))}
          autoComplete="current-password"
        />

        <div style={{ textAlign: 'right', marginTop: -6, marginBottom: 18 }}>
          <span style={{ fontSize: 13, color: colors.brand[600], fontWeight: 600 }}>Esqueci minha senha</span>
        </div>

        {error && (
          <div style={{ backgroundColor: colors.danger[50], border: `1px solid ${colors.danger[100]}`, borderRadius: radius.md, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: colors.danger[600] }}>
            {error}
          </div>
        )}

        <Button type="submit" size="lg" loading={loading} style={{ width: '100%', height: 48 }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <p style={{ textAlign: 'center', fontSize: 14, color: colors.gray[500], marginTop: 22, marginBottom: 0 }}>
        Ainda não tenho conta{' '}
        <Link to="/cadastro" style={{ color: colors.brand[600], fontWeight: 600, textDecoration: 'none' }}>Criar conta</Link>
      </p>

      <div style={{ marginTop: 24, padding: 14, backgroundColor: colors.bg, borderRadius: radius.md, border: `1px solid ${colors.border}` }}>
        <p style={{ fontSize: 12, color: colors.gray[400], marginBottom: 6, fontWeight: 600 }}>Credenciais de teste</p>
        <p style={{ fontSize: 12, color: colors.gray[500], margin: 0 }}>Tutor: bianca@email.com / 123456</p>
        <p style={{ fontSize: 12, color: colors.gray[500], margin: '2px 0 0' }}>Prestador: clinica@petfeliz.com / 123456</p>
      </div>
    </div>
  )
}

function BrandSide({ compact }: { compact: boolean }) {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: compact ? 320 : undefined, margin: compact ? '0 auto' : undefined }}>
      <div
        style={{
          position: 'absolute',
          left: compact ? -20 : -40,
          bottom: compact ? -10 : -20,
          width: compact ? 220 : 340,
          height: compact ? 220 : 340,
          backgroundColor: colors.brand[500],
          opacity: 0.16,
          borderRadius: '62% 38% 55% 45% / 48% 45% 55% 52%',
        }}
      />
      <div style={{ position: 'relative' }}>
        <h2
          style={{
            fontFamily: fontFamily.display,
            fontSize: compact ? 36 : 52,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: colors.gray[900],
            margin: 0,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            gap: compact ? 2 : 4,
          }}
        >
          <span style={{ color: colors.gray[300] }}>Zo</span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: compact ? 30 : 42,
              height: compact ? 30 : 42,
              borderRadius: '50%',
              backgroundColor: colors.brand[500],
              color: colors.white,
            }}
          >
            <PawPrint size={compact ? 16 : 22} />
          </span>
          <span style={{ color: colors.gray[900] }}>p</span>
        </h2>
        <p style={{ fontSize: compact ? 13 : 15, fontWeight: 700, color: colors.gray[700], letterSpacing: '0.02em', marginTop: 10, textTransform: 'uppercase' }}>
          Conectando quem <span style={{ color: colors.brand[600] }}>ama</span>, com quem <span style={{ color: colors.brand[600] }}>cuida</span>.
        </p>
        <div style={{ position: 'relative', marginTop: compact ? 18 : 32, maxWidth: compact ? 260 : 640 }}>
          <img
            src="/hero-pets.png"
            alt="Cachorro golden retriever e gato juntos"
            style={{ width: '100%', aspectRatio: '4 / 3', objectFit: 'cover', borderRadius: radius.xl, boxShadow: shadow.md, display: 'block' }}
          />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const isMobile = useMediaQuery('(max-width: 1023px)')

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.bg, display: 'flex', flexDirection: 'column' }}>
        <TopBar compact />
        <div style={{ padding: '28px 20px 0' }}>
          <BrandSide compact />
        </div>
        <div style={{ flex: 1, padding: '28px 20px 40px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 420, backgroundColor: colors.white, borderRadius: radius.xl, boxShadow: shadow.md, padding: '28px 24px' }}>
            <LoginForm />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg, display: 'flex', flexDirection: 'column' }}>
      <TopBar compact={false} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: '56px 48px' }}>
        <div style={{ width: '100%', maxWidth: 1360, display: 'flex', alignItems: 'center', gap: 80 }}>
          <div style={{ flex: '1 1 0' }}>
            <BrandSide compact={false} />
          </div>
          <div style={{ flex: '0 0 460px', backgroundColor: colors.white, borderRadius: radius.xl, boxShadow: shadow.md, padding: '44px 44px' }}>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
