import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { reviewService } from '../../api/reviewService'
import { prestadorService } from '../../api/prestadorService'
import { useAuth } from '../../contexts/AuthContext'
import type { ReviewResponseDto, PrestadorResponseDto } from '../../types'

export default function Avaliacoes() {
  const { tutorId } = useAuth()
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([])
  const [prestadores, setPrestadores] = useState<PrestadorResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ prestadorId: '', nota: 5, comentario: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const [rvs, prs] = await Promise.all([reviewService.listar(), prestadorService.listar()])
      setReviews(rvs)
      setPrestadores(prs)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tutorId) { setError('Tutor não identificado. Faça login novamente.'); return }
    setSaving(true)
    setError('')
    try {
      await reviewService.criar({ tutorId, prestadorId: Number(form.prestadorId), nota: form.nota, comentario: form.comentario })
      setForm({ prestadorId: '', nota: 5, comentario: '' })
      setShowForm(false)
      await load()
    } catch {
      setError('Erro ao enviar avaliação.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>Avaliações</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Avalie os prestadores que atenderam seu pet</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', backgroundColor: '#2563EB', color: '#fff', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          {showForm ? 'Cancelar' : '+ Nova avaliação'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb', marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 20 }}>Avaliar prestador</h2>
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Prestador</label>
              <select value={form.prestadorId} onChange={e => setForm(f => ({ ...f, prestadorId: e.target.value }))} required
                style={{ width: '100%', maxWidth: 360, padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }}>
                <option value="">Selecione</option>
                {prestadores.map(p => <option key={p.id} value={p.id}>{p.nomePrestador}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Nota</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} type="button" onClick={() => setForm(f => ({ ...f, nota: n }))}
                    style={{ width: 40, height: 40, borderRadius: 8, border: form.nota >= n ? 'none' : '1px solid #d1d5db', backgroundColor: form.nota >= n ? '#facc15' : '#f9fafb', fontSize: 20, cursor: 'pointer' }}>
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Comentário</label>
              <textarea value={form.comentario} onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))}
                placeholder="Como foi o atendimento?" rows={3}
                style={{ width: '100%', maxWidth: 480, padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
            {error && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#b91c1c' }}>{error}</div>
            )}
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', backgroundColor: '#2563EB', color: '#fff', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              {saving ? 'Enviando...' : 'Enviar avaliação'}
            </button>
          </form>
        </div>
      )}

      {loading ? <p style={{ color: '#6b7280' }}>Carregando...</p> : reviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>⭐</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>Nenhuma avaliação ainda</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{r.prestadorNome}</p>
                <div>{Array.from({ length: r.nota }, (_, i) => <span key={i} style={{ color: '#facc15' }}>★</span>)}</div>
              </div>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>{r.comentario}</p>
              <p style={{ fontSize: 11, color: '#9ca3af' }}>{r.prestadorCidade} • {r.prestadorBairro}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
