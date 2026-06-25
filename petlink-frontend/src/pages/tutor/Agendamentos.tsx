import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { agendamentoService } from '../../api/agendamentoService'
import { petService } from '../../api/petService'
import { prestadorService } from '../../api/prestadorService'
import { useAuth } from '../../contexts/AuthContext'
import type { AgendamentoResponseDto, PetResponseDto, PrestadorResponseDto } from '../../types'

const statusStyle: Record<string, { bg: string; color: string }> = {
  AGENDADO: { bg: '#eff6ff', color: '#2563EB' },
  CONFIRMADO: { bg: '#f0fdf4', color: '#16a34a' },
  FINALIZADO: { bg: '#f3f4f6', color: '#374151' },
  CANCELADO: { bg: '#fef2f2', color: '#b91c1c' },
}

export default function Agendamentos() {
  const { user, tutorId } = useAuth()
  const [agendamentos, setAgendamentos] = useState<AgendamentoResponseDto[]>([])
  const [pets, setPets] = useState<PetResponseDto[]>([])
  const [prestadores, setPrestadores] = useState<PrestadorResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ petId: '', prestadorId: '', dataHora: '', servico: '' })
  const [prestadorSearch, setPrestadorSearch] = useState('')
  const [servicosPrestador, setServicosPrestador] = useState<string[]>([])
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
    setServicosPrestador([])
  }

  const selectPrestador = (prestadorId: number, nome: string) => {
    setForm(f => ({ ...f, prestadorId: String(prestadorId), servico: '' }))
    setPrestadorSearch(nome)
    const prest = prestadores.find(p => p.id === prestadorId)
    if (prest?.servicos) setServicosPrestador(prest.servicos.split(',').map(s => s.trim()).filter(Boolean))
    else setServicosPrestador([])
  }

  const load = async () => {
    try {
      const [ags, ps, prs] = await Promise.all([
        agendamentoService.listar(),
        petService.listar(),
        prestadorService.listar(),
      ])
      setAgendamentos(ags.filter(a => a.tutor?.email === user?.email))
      setPets(ps.filter(p => p.tutor?.email === user?.email))
      setPrestadores(prs)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (!tutorId) { setError('Tutor não identificado. Faça login novamente.'); return }
      const dt = new Date(form.dataHora)
      const dataFormatada = `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}:00`
      await agendamentoService.criar({
        tutorId,
        petId: Number(form.petId),
        prestadorId: Number(form.prestadorId),
        dataHora: dataFormatada,
        servico: form.servico || undefined,
      })
      setForm({ petId: '', prestadorId: '', dataHora: '', servico: '' })
      setServicosPrestador([])
      setShowForm(false)
      await load()
    } catch {
      setError('Erro ao criar agendamento. Verifique se a data é futura.')
    } finally {
      setSaving(false)
    }
  }

  const formatData = (dt: string) => {
    try { return new Date(dt).toLocaleString('pt-BR') } catch { return dt }
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>Agendamentos</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>{agendamentos.length} agendamento(s)</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', backgroundColor: '#2563EB', color: '#fff', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          {showForm ? 'Cancelar' : '+ Novo agendamento'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb', marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 20 }}>Novo agendamento</h2>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Pet</label>
              <select value={form.petId} onChange={e => setForm(f => ({ ...f, petId: e.target.value }))} required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}>
                <option value="">Selecione o pet</option>
                {pets.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Prestador</label>
              <input value={prestadorSearch} onChange={e => handlePrestadorSearch(e.target.value)}
                placeholder="Digite nome, cidade, bairro ou serviço..."
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
              />
              {showPrestadorSuggestions && (
                <div style={{ marginTop: 8, backgroundColor: '#fff', border: '1px solid #d1d5db', borderRadius: 12, maxHeight: 280, overflowY: 'auto', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)' }}>
                  {prestadorSuggestions.length > 0 ? prestadorSuggestions.map(p => (
                    <button key={p.id} type="button" onClick={() => selectPrestador(p.id, p.nomePrestador)}
                      style={{ width: '100%', textAlign: 'left', padding: '12px 14px', border: 'none', borderBottom: '1px solid #f3f4f6', background: 'transparent', cursor: 'pointer' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{p.nomePrestador}</div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{[p.bairro, p.cidade].filter(Boolean).join(', ')}</div>
                      <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>{p.servicos?.split(',').slice(0, 2).map(s => s.trim()).join(', ')}</div>
                    </button>
                  )) : (
                    <div style={{ padding: '10px 14px', fontSize: 13, color: '#6b7280' }}>Nenhum prestador encontrado.</div>
                  )}
                </div>
              )}
              <input type="hidden" value={form.prestadorId} />
              {selectedPrestador && (
                <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 12, backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{selectedPrestador.nomePrestador}</p>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>{[selectedPrestador.bairro, selectedPrestador.cidade].filter(Boolean).join(', ')}</p>
                  <p style={{ fontSize: 12, color: '#16a34a', marginTop: 6 }}>{selectedPrestador.servicos}</p>
                </div>
              )}
            </div>
            {servicosPrestador.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Serviço desejado</label>
                <select value={form.servico} onChange={e => setForm(f => ({ ...f, servico: e.target.value }))} required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}>
                  <option value="">Selecione o serviço</option>
                  {servicosPrestador.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            <div style={{ gridColumn: servicosPrestador.length > 0 ? 'auto' : '1/-1' }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Data e hora</label>
              <input type="datetime-local" value={form.dataHora} onChange={e => setForm(f => ({ ...f, dataHora: e.target.value }))} required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>
            {error && (
              <div style={{ gridColumn: '1/-1', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#b91c1c' }}>{error}</div>
            )}
            <div style={{ gridColumn: '1/-1' }}>
              <button type="submit" disabled={saving} style={{ padding: '10px 24px', backgroundColor: '#2563EB', color: '#fff', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                {saving ? 'Agendando...' : 'Confirmar agendamento'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? <p style={{ color: '#6b7280' }}>Carregando...</p> : agendamentos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>📅</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>Nenhum agendamento ainda</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {agendamentos.map(a => {
            const st = statusStyle[a.status] ?? { bg: '#f3f4f6', color: '#374151' }
            return (
              <div key={a.id} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{a.prestador?.nomePrestador}</p>
                    <span style={{ fontSize: 11, fontWeight: 600, backgroundColor: st.bg, color: st.color, padding: '2px 8px', borderRadius: 6 }}>{a.status}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280' }}>
                    🐾 {a.pet?.nome} • 🏥 {a.servico ?? 'Serviço não informado'} • 📅 {formatData(a.dataHora)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}
