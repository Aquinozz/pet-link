import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { authService } from '../../api/authService'

export default function LoginPage() {
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 28, fontWeight: 800, color: '#111827' }}>
              Pet<span style={{ color: '#2563EB' }}>Link</span>
            </span>
          </Link>
          <p style={{ color: '#6b7280', marginTop: 8, fontSize: 15 }}>Entre na sua conta</p>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, border: '1px solid #e5e7eb', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="seu@email.com"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Senha</label>
              <input
                type="password" required
                value={form.senha}
                onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
                placeholder="••••••"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#b91c1c' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: 12, borderRadius: 10, border: 'none',
              backgroundColor: loading ? '#93c5fd' : '#2563EB', color: '#fff',
              fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div style={{ marginTop: 20, padding: 14, backgroundColor: '#f8fafc', borderRadius: 8, border: '1px solid #f3f4f6' }}>
            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6, fontWeight: 600 }}>Credenciais de teste:</p>
            <p style={{ fontSize: 12, color: '#6b7280' }}>Tutor: bianca@email.com / 123456</p>
            <p style={{ fontSize: 12, color: '#6b7280' }}>Prestador: clinica@petfeliz.com / 123456</p>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          Não tem conta?{' '}
          <Link to="/cadastro" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Cadastre-se grátis</Link>
        </p>
      </div>
    </div>
  )
}
