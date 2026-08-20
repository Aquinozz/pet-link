import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock } from 'lucide-react'
import { useAuth } from '../../contexts/useAuth'
import { authService } from '../../api/authService'
import { BrandLogo } from '../../components/BrandLogo'
import { Button } from '../../components/ui/Button'
import { AuthField } from '../../components/auth/AuthField'
import { AuthBrandPanel } from '../../components/auth/AuthBrandPanel'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { colors, radius } from '../../theme/tokens'

function LoginForm() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
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
    <div style={{ width: '100%', maxWidth: 400 }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.brand[600], marginBottom: 12 }}>
        Acesso à plataforma
      </p>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: colors.gray[900], lineHeight: 1.2, marginBottom: 6 }}>
        Entre na sua conta
      </h1>
      <p style={{ fontSize: 14, color: colors.gray[500], lineHeight: 1.6, marginBottom: 28 }}>
        Acesse para gerenciar seus pets, agendamentos e avaliações.
      </p>

      <form onSubmit={handleSubmit}>
        <AuthField
          icon={<Mail size={17} />}
          type="email"
          placeholder="seu@email.com"
          value={form.email}
          onChange={v => setForm(f => ({ ...f, email: v }))}
          autoComplete="email"
        />
        <AuthField
          icon={<Lock size={17} />}
          type="password"
          placeholder="Sua senha"
          value={form.senha}
          onChange={v => setForm(f => ({ ...f, senha: v }))}
          autoComplete="current-password"
        />

        {error && (
          <div style={{ backgroundColor: colors.danger[50], border: `1px solid ${colors.danger[100]}`, borderRadius: radius.md, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: colors.danger[600] }}>
            {error}
          </div>
        )}

        <Button type="submit" size="lg" loading={loading} style={{ width: '100%', height: 46 }}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>

      <p style={{ textAlign: 'center', fontSize: 14, color: colors.gray[500], marginTop: 24 }}>
        Ainda não tem conta?{' '}
        <Link to="/cadastro" style={{ color: colors.brand[600], fontWeight: 600, textDecoration: 'none' }}>Cadastre-se grátis</Link>
      </p>

      <div style={{ marginTop: 24, padding: 14, backgroundColor: colors.bg, borderRadius: radius.md, border: `1px solid ${colors.border}` }}>
        <p style={{ fontSize: 12, color: colors.gray[400], marginBottom: 6, fontWeight: 600 }}>Credenciais de teste</p>
        <p style={{ fontSize: 12, color: colors.gray[500], margin: 0 }}>Tutor: bianca@email.com / 123456</p>
        <p style={{ fontSize: 12, color: colors.gray[500], margin: '2px 0 0' }}>Prestador: clinica@petfeliz.com / 123456</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  const isMobile = useMediaQuery('(max-width: 1023px)')

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.white, display: 'flex', flexDirection: 'column' }}>
        <div style={{ backgroundColor: colors.brand[900], padding: '20px 20px 22px' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <BrandLogo size={28} colorText={colors.white} />
          </Link>
          <p style={{ color: colors.brand[200], fontSize: 13, marginTop: 8 }}>Encontre quem cuida do seu pet</p>
        </div>
        <div style={{ flex: 1, padding: '36px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoginForm />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: colors.white }}>
      <AuthBrandPanel />
      <section style={{ flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
        <LoginForm />
      </section>
    </div>
  )
}
