import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { reviewService } from '../../api/reviewService'
import { prestadorService } from '../../api/prestadorService'
import { useAuth } from '../../contexts/useAuth'
import type { ReviewResponseDto, PrestadorResponseDto } from '../../types'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/Input'
import { StarRating, StarRatingInput } from '../../components/ui/StarRating'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { colors, radius } from '../../theme/tokens'

export default function Avaliacoes() {
  const { tutorId } = useAuth()
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([])
  const [prestadores, setPrestadores] = useState<PrestadorResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ prestadorId: '', nota: 5, comentario: '' })
  const [prestadorSearch, setPrestadorSearch] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const selectedPrestador = prestadores.find(p => String(p.id) === form.prestadorId)
  const prestadorSuggestions = prestadorSearch ? prestadores.filter(p => {
    const term = prestadorSearch.toLowerCase()
    return p.nomePrestador.toLowerCase().includes(term)
      || p.cidade?.toLowerCase().includes(term)
      || p.bairro?.toLowerCase().includes(term)
      || p.servicos?.toLowerCase().includes(term)
  }).slice(0, 8) : []
  const showPrestadorSuggestions = !!prestadorSearch && !selectedPrestador

  const handlePrestadorSearch = (value: string) => {
    setPrestadorSearch(value)
    setForm(f => ({ ...f, prestadorId: '' }))
  }

  const selectPrestador = (prestadorId: number, nome: string) => {
    setForm(f => ({ ...f, prestadorId: String(prestadorId) }))
    setPrestadorSearch(nome)
  }

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
      <PageHeader
        title="Avaliações"
        subtitle="Avalie os prestadores que atenderam seu pet"
        actions={
          <Button variant={showForm ? 'secondary' : 'primary'} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : '+ Nova avaliação'}
          </Button>
        }
      />

      {showForm && (
        <Card padding={24} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.gray[900], marginBottom: 20 }}>Avaliar prestador</h2>
          <form onSubmit={handleSave} style={{ maxWidth: 500 }}>
            <Input label="Prestador" value={prestadorSearch} onChange={e => handlePrestadorSearch(e.target.value)}
              placeholder="Digite nome, cidade, bairro ou serviço..." />
            {showPrestadorSuggestions && (
              <div style={{ marginTop: -8, marginBottom: 16, backgroundColor: colors.white, border: `1px solid ${colors.border}`, borderRadius: radius.lg, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                {prestadorSuggestions.length > 0 ? prestadorSuggestions.map(p => (
                  <button key={p.id} type="button" onClick={() => selectPrestador(p.id, p.nomePrestador)}
                    style={{ width: '100%', textAlign: 'left', padding: '10px 14px', border: 'none', borderBottom: `1px solid ${colors.border}`, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: colors.gray[900] }}>{p.nomePrestador}</div>
                    <div style={{ fontSize: 12, color: colors.gray[500] }}>{[p.bairro, p.cidade].filter(Boolean).join(', ')} · {p.servicos?.split(',').slice(0, 2).map(s => s.trim()).join(', ')}</div>
                  </button>
                )) : (
                  <div style={{ padding: '10px 14px', fontSize: 13, color: colors.gray[500] }}>Nenhum prestador encontrado.</div>
                )}
              </div>
            )}
            <input type="hidden" value={form.prestadorId} />
            {selectedPrestador && (
              <div style={{ marginBottom: 16, padding: '12px 14px', borderRadius: radius.lg, backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: colors.gray[900], marginBottom: 4 }}>{selectedPrestador.nomePrestador}</p>
                    <p style={{ fontSize: 12, color: colors.gray[500], marginBottom: 4 }}>{[selectedPrestador.bairro, selectedPrestador.cidade].filter(Boolean).join(', ')}</p>
                    <p style={{ fontSize: 12, color: colors.brand[600] }}>{selectedPrestador.servicos}</p>
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => { setForm(f => ({ ...f, prestadorId: '' })); setPrestadorSearch('') }}>Alterar</Button>
                </div>
              </div>
            )}
            <div style={{ marginBottom: 8 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.gray[700], marginBottom: 8 }}>Nota</label>
              <StarRatingInput value={form.nota} onChange={n => setForm(f => ({ ...f, nota: n }))} />
            </div>
            <Textarea label="Comentário" value={form.comentario} onChange={e => setForm(f => ({ ...f, comentario: e.target.value }))}
              placeholder="Como foi o atendimento?" rows={3} />
            {error && (
              <div style={{ backgroundColor: colors.danger[50], border: `1px solid ${colors.danger[100]}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: colors.danger[600] }}>{error}</div>
            )}
            <Button type="submit" loading={saving}>{saving ? 'Enviando...' : 'Enviar avaliação'}</Button>
          </form>
        </Card>
      )}

      {loading ? (
        <Card padding={24}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={52} />)}
          </div>
        </Card>
      ) : reviews.length === 0 ? (
        <EmptyState
          icon={<Star size={28} fill={colors.accent} color={colors.accent} />}
          title="Nenhuma avaliação ainda"
          description="Avalie um prestador para compartilhar sua experiência com outros tutores."
        >
          <Button onClick={() => setShowForm(true)}>+ Nova avaliação</Button>
        </EmptyState>
      ) : (
        <div>
          {reviews.map((r, i) => (
            <div key={r.id} style={{ padding: '18px 4px', borderBottom: i < reviews.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                <p style={{ fontSize: 15, fontWeight: 700, color: colors.gray[900], margin: 0 }}>{r.prestadorNome}</p>
                <StarRating value={r.nota} />
              </div>
              {r.comentario && <p style={{ fontSize: 14, color: colors.gray[500], margin: '0 0 6px', lineHeight: 1.6 }}>{r.comentario}</p>}
              <p style={{ fontSize: 12, color: colors.gray[400], margin: 0 }}>{r.prestadorCidade}{r.prestadorBairro ? ` • ${r.prestadorBairro}` : ''}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
