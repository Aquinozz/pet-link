import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../api/authService'

export default function CadastroPage() {
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

  const labels: Record<string, string> = {
    nome: 'Nome completo',
    email: 'Email',
    senha: 'Senha',
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
          <p style={{ color: '#6b7280', marginTop: 8, fontSize: 15 }}>Crie sua conta gratuita</p>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 32, border: '1px solid #e5e7eb', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}>
          <form onSubmit={handleSubmit}>
            {(['nome', 'email', 'senha'] as const).map((field) => (
              <div key={field} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  {labels[field]}
                </label>
                <input
                  type={field === 'senha' ? 'password' : field === 'email' ? 'email' : 'text'}
                  required
                  value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={field === 'nome' ? 'Seu nome' : field === 'email' ? 'seu@email.com' : '••••••'}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, color: '#111827', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            ))}

            {error && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#b91c1c' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: 12, borderRadius: 10, border: 'none',
              backgroundColor: loading ? '#93c5fd' : '#2563EB', color: '#fff',
              fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8,
            }}>
              {loading ? 'Cadastrando...' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#6b7280' }}>
          Já tem conta?{' '}
          <Link to="/login" style={{ color: '#2563EB', fontWeight: 600, textDecoration: 'none' }}>Entrar</Link>
        </p>
      </div>
    </div>
  )
}
