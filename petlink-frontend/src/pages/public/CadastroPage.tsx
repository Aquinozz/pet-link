import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock } from 'lucide-react'
import { authService } from '../../api/authService'
import { BrandLogo } from '../../components/BrandLogo'
import { Button } from '../../components/ui/Button'
import { AuthField } from '../../components/auth/AuthField'
import { AuthBrandPanel } from '../../components/auth/AuthBrandPanel'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { colors, radius } from '../../theme/tokens'

function CadastroForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authService.register(form)
      navigate('/login')
    } catch {
      setError('Erro ao cadastrar. Verifique os dados ou tente outro email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: colors.brand[600], marginBottom: 12 }}>
        Crie sua conta
      </p>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: colors.gray[900], lineHeight: 1.2, marginBottom: 6 }}>
        Comece em menos de um minuto
      </h1>
      <p style={{ fontSize: 14, color: colors.gray[500], lineHeight: 1.6, marginBottom: 28 }}>
        Cadastre-se para encontrar profissionais e gerenciar seus pets.
      </p>

      <form onSubmit={handleSubmit}>
        <AuthField
          icon={<User size={17} />}
          type="text"
          placeholder="Seu nome"
          value={form.nome}
          onChange={v => setForm(f => ({ ...f, nome: v }))}
          autoComplete="name"
        />
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
          placeholder="Crie uma senha"
          value={form.senha}
          onChange={v => setForm(f => ({ ...f, senha: v }))}
          autoComplete="new-password"
        />

        {error && (
          <div style={{ backgroundColor: colors.danger[50], border: `1px solid ${colors.danger[100]}`, borderRadius: radius.md, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: colors.danger[600] }}>
            {error}
          </div>
        )}

        <Button type="submit" size="lg" loading={loading} style={{ width: '100%', height: 46 }}>
          {loading ? 'Cadastrando...' : 'Criar conta'}
        </Button>
      </form>

      <p style={{ textAlign: 'center', fontSize: 14, color: colors.gray[500], marginTop: 24 }}>
        Já tem conta?{' '}
        <Link to="/login" style={{ color: colors.brand[600], fontWeight: 600, textDecoration: 'none' }}>Entrar</Link>
      </p>

      <p style={{ textAlign: 'center', fontSize: 12, color: colors.gray[400], marginTop: 20, lineHeight: 1.6 }}>
        Ao criar a conta, você concorda com os termos de uso do PetLink.
      </p>
    </div>
  )
}

export default function CadastroPage() {
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
          <CadastroForm />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: colors.white }}>
      <AuthBrandPanel />
      <section style={{ flex: '1 1 0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 40px' }}>
        <CadastroForm />
      </section>
    </div>
  )
}
