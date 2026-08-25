import { useCallback, useEffect, useState } from 'react'
import { Calendar, PawPrint, Building, MapPin, Star, Check } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { agendamentoService } from '../../api/agendamentoService'
import { petService } from '../../api/petService'
import { prestadorService } from '../../api/prestadorService'
import { reviewService } from '../../api/reviewService'
import { useAuth } from '../../contexts/useAuth'
import type { AgendamentoResponseDto, PetResponseDto, PrestadorResponseDto } from '../../types'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select, Textarea } from '../../components/ui/Input'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { StarRatingInput } from '../../components/ui/StarRating'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { colors, radius, transition } from '../../theme/tokens'
import { useIsMobile } from '../../hooks/useMediaQuery'

type Aba = 'proximos' | 'concluidos' | 'cancelados'

const abasConfig: { key: Aba; label: string }[] = [
  { key: 'proximos', label: 'Próximos' },
  { key: 'concluidos', label: 'Concluídos' },
  { key: 'cancelados', label: 'Cancelados' },
]

export default function Agendamentos() {
  const isMobile = useIsMobile()
  const { user, tutorId } = useAuth()
  const [agendamentos, setAgendamentos] = useState<AgendamentoResponseDto[]>([])
  const [pets, setPets] = useState<PetResponseDto[]>([])
  const [prestadores, setPrestadores] = useState<PrestadorResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ petId: '', prestadorId: '', dataHora: '', servico: '', domicilio: false, endereco: '' })
  const [prestadorSearch, setPrestadorSearch] = useState('')
  const [servicosPrestador, setServicosPrestador] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [aba, setAba] = useState<Aba>('proximos')
  const [avaliados, setAvaliados] = useState<Set<number>>(new Set())
  const [avaliandoId, setAvaliandoId] = useState<number | null>(null)
  const [avForm, setAvForm] = useState({ nota: 5, comentario: '' })
  const [savingAv, setSavingAv] = useState(false)
  const [errorAv, setErrorAv] = useState('')

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

  const load = useCallback(async () => {
    try {
      const [ags, ps, prs, rvs] = await Promise.all([
        agendamentoService.listar(),
        petService.listar(),
        prestadorService.listar(),
        reviewService.listar(),
      ])
      setAgendamentos(ags.filter(a => a.tutor?.email === user?.email))
      setPets(ps.filter(p => p.tutor?.email === user?.email))
      setPrestadores(prs)
      setAvaliados(new Set(rvs.map(r => r.agendamentoId).filter((id): id is number => id != null)))
    } catch {
    } finally {
      setLoading(false)
    }
  }, [user?.email])

  useEffect(() => { load() }, [load])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (!tutorId) { setError('Tutor não identificado. Faça login novamente.'); return }
      if (form.domicilio && !form.endereco.trim()) { setError('Informe o endereço do atendimento a domicílio.'); return }
      const dt = new Date(form.dataHora)
      const dataFormatada = `${String(dt.getDate()).padStart(2,'0')}/${String(dt.getMonth()+1).padStart(2,'0')}/${dt.getFullYear()} ${String(dt.getHours()).padStart(2,'0')}:${String(dt.getMinutes()).padStart(2,'0')}:00`
      await agendamentoService.criar({
        tutorId,
        petId: Number(form.petId),
        prestadorId: Number(form.prestadorId),
        dataHora: dataFormatada,
        servico: form.servico || undefined,
        atendimentoDomiciliar: form.domicilio || undefined,
        enderecoAtendimento: form.domicilio ? form.endereco.trim() : undefined,
      })
      setForm({ petId: '', prestadorId: '', dataHora: '', servico: '', domicilio: false, endereco: '' })
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

  const proximos = agendamentos.filter(a => a.status === 'AGENDADO' || a.status === 'CONFIRMADO')
  const concluidos = agendamentos.filter(a => a.status === 'FINALIZADO')
  const cancelados = agendamentos.filter(a => a.status === 'CANCELADO')
  const listaAtual = aba === 'proximos' ? proximos : aba === 'concluidos' ? concluidos : cancelados
  const contagemPorAba: Record<Aba, number> = { proximos: proximos.length, concluidos: concluidos.length, cancelados: cancelados.length }

  const abrirAvaliacao = (a: AgendamentoResponseDto) => {
    setAvaliandoId(a.id)
    setAvForm({ nota: 5, comentario: '' })
    setErrorAv('')
  }

  const handleAvaliar = async (a: AgendamentoResponseDto, e: React.FormEvent) => {
    e.preventDefault()
    if (!tutorId) { setErrorAv('Faça login novamente.'); return }
    setErrorAv('')
    setSavingAv(true)
    try {
      await reviewService.criar({
        tutorId,
        prestadorId: Number(a.prestador?.id),
        agendamentoId: a.id,
        nota: avForm.nota,
        comentario: avForm.comentario,
      })
      setAvaliados(prev => new Set(prev).add(a.id))
      setAvaliandoId(null)
    } catch {
      setErrorAv('Erro ao enviar avaliação. Verifique se o atendimento foi concluído pelo profissional.')
    } finally {
      setSavingAv(false)
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Agendamentos"
        subtitle={`${agendamentos.length} agendamento(s)`}
        actions={
          <Button variant={showForm ? 'secondary' : 'primary'} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : '+ Novo agendamento'}
          </Button>
        }
      />

      {showForm && (
        <Card padding={24} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.gray[900], marginBottom: 20 }}>Novo agendamento</h2>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '0 16px' }}>
            <Select label="Pet" value={form.petId} onChange={e => setForm(f => ({ ...f, petId: e.target.value }))} required>
              <option value="">Selecione o pet</option>
              {pets.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </Select>
            <div>
              <Input label="Prestador" value={prestadorSearch} onChange={e => handlePrestadorSearch(e.target.value)}
                placeholder="Digite nome, cidade, bairro ou serviço..." />
              {showPrestadorSuggestions && (
                <div style={{ marginTop: -8, marginBottom: 16, backgroundColor: colors.white, border: `1px solid ${colors.border}`, borderRadius: radius.lg, maxHeight: 280, overflowY: 'auto', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.06)' }}>
                  {prestadorSuggestions.length > 0 ? prestadorSuggestions.map(p => (
                    <button key={p.id} type="button" onClick={() => selectPrestador(p.id, p.nomePrestador)}
                      style={{ width: '100%', textAlign: 'left', padding: '12px 14px', border: 'none', borderBottom: `1px solid ${colors.border}`, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: colors.gray[900] }}>{p.nomePrestador}</div>
                      <div style={{ fontSize: 12, color: colors.gray[500] }}>{[p.bairro, p.cidade].filter(Boolean).join(', ')}</div>
                      <div style={{ fontSize: 12, color: colors.brand[600], marginTop: 4 }}>{p.servicos?.split(',').slice(0, 2).map(s => s.trim()).join(', ')}</div>
                    </button>
                  )) : (
                    <div style={{ padding: '10px 14px', fontSize: 13, color: colors.gray[500] }}>Nenhum prestador encontrado.</div>
                  )}
                </div>
              )}
              <input type="hidden" value={form.prestadorId} />
              {selectedPrestador && (
                <div style={{ marginBottom: 16, padding: '12px 14px', borderRadius: radius.lg, backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: colors.gray[900], marginBottom: 4 }}>{selectedPrestador.nomePrestador}</p>
                  <p style={{ fontSize: 12, color: colors.gray[500] }}>{[selectedPrestador.bairro, selectedPrestador.cidade].filter(Boolean).join(', ')}</p>
                  <p style={{ fontSize: 12, color: colors.brand[600], marginTop: 6 }}>{selectedPrestador.servicos}</p>
                </div>
              )}
            </div>
            {servicosPrestador.length > 0 && (
              <Select label="Serviço desejado" value={form.servico} onChange={e => setForm(f => ({ ...f, servico: e.target.value }))} required>
                <option value="">Selecione o serviço</option>
                {servicosPrestador.map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            )}
            <Input label="Data e hora" type="datetime-local" value={form.dataHora} onChange={e => setForm(f => ({ ...f, dataHora: e.target.value }))} required />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: colors.gray[700], padding: '12px 0' }}>
                <input
                  type="checkbox"
                  checked={form.domicilio}
                  onChange={e => setForm(f => ({ ...f, domicilio: e.target.checked }))}
                  style={{ width: 16, height: 16, accentColor: colors.brand[600], cursor: 'pointer' }}
                />
                Atendimento em domicílio <MapPin size={15} color={colors.brand[600]} />
              </label>
            </div>
            {form.domicilio && (
              <div style={{ gridColumn: '1/-1' }}>
                <Input
                  label="Endereço do atendimento"
                  value={form.endereco}
                  onChange={e => setForm(f => ({ ...f, endereco: e.target.value }))}
                  placeholder="Ex.: Rua das Flores, 123 - Centro"
                  maxLength={300}
                />
                <p style={{ fontSize: 12, color: colors.gray[500], marginTop: 6 }}>
                  O profissional verá este endereço para ter uma noção da distância.
                </p>
              </div>
            )}
            {error && (
              <div style={{ gridColumn: '1/-1', backgroundColor: colors.danger[50], border: `1px solid ${colors.danger[100]}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: colors.danger[600] }}>{error}</div>
            )}
            <div style={{ gridColumn: '1/-1' }}>
              <Button type="submit" loading={saving}>{saving ? 'Agendando...' : 'Confirmar agendamento'}</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <Card padding={24}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={52} />)}
          </div>
        </Card>
      ) : agendamentos.length === 0 ? (
        <EmptyState
          icon={<Calendar size={28} />}
          title="Nenhum agendamento ainda"
          description="Crie um novo agendamento para acompanhar aqui."
        >
          <Button onClick={() => setShowForm(true)}>+ Novo agendamento</Button>
        </EmptyState>
      ) : (
        <>
          <div style={{ display: 'flex', borderBottom: `2px solid ${colors.border}`, marginBottom: 20 }}>
            {abasConfig.map(t => (
              <button
                key={t.key}
                onClick={() => { setAba(t.key); setAvaliandoId(null) }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 18px',
                  background: 'none',
                  border: 'none',
                  borderBottom: aba === t.key ? `2px solid ${colors.brand[600]}` : '2px solid transparent',
                  fontWeight: aba === t.key ? 700 : 500,
                  color: aba === t.key ? colors.brand[600] : colors.gray[500],
                  fontSize: 14,
                  cursor: 'pointer',
                  marginBottom: -2,
                  fontFamily: 'inherit',
                }}
              >
                {t.label}
                <span style={{
                  fontSize: 11.5, fontWeight: 700,
                  padding: '1px 8px', borderRadius: 999,
                  backgroundColor: aba === t.key ? colors.brand[100] : colors.gray[100],
                  color: aba === t.key ? colors.brand[700] : colors.gray[500],
                }}>
                  {contagemPorAba[t.key]}
                </span>
              </button>
            ))}
          </div>

          <Card padding={24}>
            {listaAtual.length === 0 ? (
              <EmptyState
                icon={<Calendar size={26} />}
                title={aba === 'concluidos' ? 'Nenhuma consulta concluída ainda' : aba === 'cancelados' ? 'Nenhum agendamento cancelado' : 'Nenhum agendamento próximo'}
                description={
                  aba === 'concluidos'
                    ? 'Quando o profissional confirmar que o atendimento foi realizado, você poderá avaliá-lo aqui.'
                    : aba === 'cancelados'
                      ? 'Agendamentos cancelados aparecerão nesta lista.'
                      : 'Crie um novo agendamento para acompanhá-lo aqui.'
                }
              />
            ) : (
              <div>
                {listaAtual.map((a) => (
                  <div key={a.id} style={{ padding: '16px 12px', borderRadius: 10, marginBottom: 8, transition, cursor: 'default' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.gray[50] }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: colors.gray[900], margin: 0 }}>{a.prestador?.nomePrestador}</p>
                      <StatusBadge status={a.status} />
                      {aba === 'concluidos' && avaliados.has(a.id) && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11.5, fontWeight: 600, padding: '3px 10px', borderRadius: radius.sm, backgroundColor: colors.success[50], color: colors.success[600], border: `1px solid ${colors.success[100]}` }}>
                          <Check size={12} /> Avaliado
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 13, color: colors.gray[500], margin: 0 }}>
                      <PawPrint size={13} /> {a.pet?.nome} • <Building size={13} /> {a.servico ?? 'Serviço não informado'} • <Calendar size={13} /> {formatData(a.dataHora)}
                    </p>
                    {a.atendimentoDomiciliar && a.enderecoAtendimento && (
                      <p style={{ fontSize: 12.5, color: colors.gray[500], margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <MapPin size={13} color={colors.brand[600]} />
                        <span style={{ color: colors.gray[700], fontWeight: 500 }}>Domicílio:</span> {a.enderecoAtendimento}
                      </p>
                    )}
                    {aba === 'concluidos' && !avaliados.has(a.id) && avaliandoId !== a.id && (
                      <div style={{ marginTop: 12 }}>
                        <Button size="sm" variant="secondary" onClick={() => abrirAvaliacao(a)}>
                          <Star size={14} color={colors.brand[600]} /> Avaliar atendimento
                        </Button>
                      </div>
                    )}
                    {avaliandoId === a.id && (
                      <form onSubmit={e => handleAvaliar(a, e)} style={{ marginTop: 14, padding: 16, borderRadius: radius.lg, backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}>
                        {errorAv && (
                          <div style={{ backgroundColor: colors.danger[50], border: `1px solid ${colors.danger[100]}`, borderRadius: 8, padding: '10px 14px', marginBottom: 12, fontSize: 13, color: colors.danger[600] }}>{errorAv}</div>
                        )}
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.gray[700], marginBottom: 8 }}>Como foi o atendimento de {a.prestador?.nomePrestador}?</label>
                        <StarRatingInput value={avForm.nota} onChange={n => setAvForm(f => ({ ...f, nota: n }))} />
                        <Textarea
                          label="Comentário"
                          value={avForm.comentario}
                          onChange={e => setAvForm(f => ({ ...f, comentario: e.target.value }))}
                          placeholder="Conte como foi a experiência..."
                          rows={3}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                          <Button type="submit" loading={savingAv}>{savingAv ? 'Enviando...' : 'Enviar avaliação'}</Button>
                          <Button type="button" variant="secondary" onClick={() => setAvaliandoId(null)}>Cancelar</Button>
                        </div>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </DashboardLayout>
  )
}
