import { useEffect, useState } from 'react'
import { API_URL } from '../../api/axiosInstance'
import { petService } from '../../api/petService'
import { agendamentoService } from '../../api/agendamentoService'
import { reviewService } from '../../api/reviewService'
import { useAuth } from '../../contexts/AuthContext'
import type { PrestadorResponseDto, PetResponseDto } from '../../types'

const tipoLabel: Record<string, string> = {
  CLINICA_VETERINARIA: 'Clínica Veterinária',
  VETERINARIO: 'Veterinário',
  PETSHOP: 'Pet Shop',
  PASSEADOR: 'Passeador',
  CRECHE_PET: 'Creche Pet',
  BANHO_E_TOSA: 'Banho e Tosa',
  PET_SITTER: 'Pet Sitter',
}

const whatsappLink = (tel: string) =>
  `https://api.whatsapp.com/send?phone=55${tel.replace(/\D/g, '')}&text=${encodeURIComponent('Olá! Vi seu perfil no PetLink e gostaria de agendar um serviço.')}`

const stars = (n: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <span key={i} style={{ color: i < Math.round(n) ? '#facc15' : '#F4F7F6', fontSize: 18 }}>★</span>
  ))

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: 20,
}

const modalStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: 20,
  width: '100%',
  maxWidth: 560,
  maxHeight: '90vh',
  overflowY: 'auto',
  padding: 32,
  position: 'relative',
}

export default function PrestadorProfileModal({
  prestador,
  onClose,
  onSuccess,
}: {
  prestador: PrestadorResponseDto
  onClose: () => void
  onSuccess: () => void
}) {
  const { tutorId } = useAuth()
  const [activeTab, setActiveTab] = useState<'agendar' | 'avaliar'>('agendar')

  const [pets, setPets] = useState<PetResponseDto[]>([])
  const [loadingPets, setLoadingPets] = useState(true)

  const [agForm, setAgForm] = useState({ petId: '', dataHora: '', servico: '' })
  const [savingAg, setSavingAg] = useState(false)
  const [errorAg, setErrorAg] = useState('')

  const [avForm, setAvForm] = useState({ nota: 5, comentario: '' })
  const [savingAv, setSavingAv] = useState(false)
  const [errorAv, setErrorAv] = useState('')
  const [successAv, setSuccessAv] = useState('')

  const servicos = prestador.servicos
    ? prestador.servicos.split(',').map(s => s.trim()).filter(Boolean)
    : []

  useEffect(() => {
    setLoadingPets(true)
    petService.listar()
      .then(data => {
        if (tutorId) setPets(data.filter(p => p.tutor?.id === tutorId))
        else setPets(data)
      })
      .catch(() => {})
      .finally(() => setLoadingPets(false))
  }, [tutorId])

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tutorId) { setErrorAg('Faça login novamente.'); return }
    setErrorAg('')
    setSavingAg(true)
    try {
      const dt = new Date(agForm.dataHora)
      const pad = (n: number) => String(n).padStart(2, '0')
      const dataFormatada = `${pad(dt.getDate())}/${pad(dt.getMonth() + 1)}/${dt.getFullYear()} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:00`
      await agendamentoService.criar({
        tutorId,
        petId: Number(agForm.petId),
        prestadorId: prestador.id,
        dataHora: dataFormatada,
        servico: agForm.servico || undefined,
      })
      onSuccess()
      onClose()
    } catch {
      setErrorAg('Erro ao criar agendamento. Verifique se a data é futura.')
    } finally {
      setSavingAg(false)
    }
  }

  const handleAvaliar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tutorId) { setErrorAv('Faça login novamente.'); return }
    setErrorAv('')
    setSuccessAv('')
    setSavingAv(true)
    try {
      await reviewService.criar({
        tutorId,
        prestadorId: prestador.id,
        nota: avForm.nota,
        comentario: avForm.comentario,
      })
      setSuccessAv('Avaliação enviada com sucesso!')
      setAvForm({ nota: 5, comentario: '' })
      setTimeout(() => { onSuccess(); onClose() }, 1500)
    } catch {
      setErrorAv('Erro ao enviar avaliação.')
    } finally {
      setSavingAv(false)
    }
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>
          ✕
        </button>

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
            {prestador.fotoUrl ? (
              <img src={`${API_URL}${prestador.fotoUrl}`} alt={prestador.nomePrestador}
                style={{ width: 56, height: 56, borderRadius: 16, objectFit: 'cover', flexShrink: 0 }}
              />
            ) : (
              <div style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: '#EAF8ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>🏥</div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0 }}>{prestador.nomePrestador}</h2>
                {prestador.type && (
                  <span style={{ fontSize: 11, backgroundColor: '#EAF8ED', color: '#22C55E', padding: '3px 10px', borderRadius: 6, fontWeight: 600 }}>
                    {tipoLabel[prestador.type] ?? prestador.type}
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <div style={{ display: 'flex', gap: 2 }}>{stars(prestador.avaliacaoMedia ?? 0)}</div>
                <span style={{ fontSize: 13, color: '#6b7280' }}>({prestador.avaliacaoMedia?.toFixed(1) ?? '—'})</span>
              </div>
            </div>
          </div>
        </div>

        {prestador.descricao && (
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12, lineHeight: 1.5 }}>{prestador.descricao}</p>
        )}

        {servicos.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {servicos.map(s => (
              <span key={s} style={{ fontSize: 11, backgroundColor: '#EAF8ED', color: '#0D3B34', padding: '3px 10px', borderRadius: 20, fontWeight: 600, border: '1px solid #A7E07E' }}>
                {s}
              </span>
            ))}
          </div>
        )}

        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {(prestador.cidade || prestador.bairro) && (
            <span>📍 {[prestador.bairro, prestador.cidade].filter(Boolean).join(', ')}</span>
          )}
          {prestador.horarioFuncionamento && <span>🕐 {prestador.horarioFuncionamento}</span>}
        </div>
        <div style={{ fontSize: 12, color: '#9ca3af', marginBottom: 16 }}>
          <span>📧 {prestador.email}</span>
          {prestador.telefone && <span style={{ marginLeft: 16 }}>📞 {prestador.telefone}</span>}
        </div>

        {prestador.telefone && (
          <a href={whatsappLink(prestador.telefone)} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ display: 'block', padding: '10px 0', backgroundColor: '#22c55e', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', textAlign: 'center', marginBottom: 20 }}>
            💬 Falar no WhatsApp
          </a>
        )}

        <div style={{ display: 'flex', borderBottom: '2px solid #F4F7F6', marginBottom: 20 }}>
          {(['agendar', 'avaliar'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: '12px 0', background: 'none', border: 'none',
                borderBottom: activeTab === tab ? '2px solid #22C55E' : '2px solid transparent',
                fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab ? '#22C55E' : '#6b7280',
                fontSize: 14, cursor: 'pointer',
                marginBottom: -2,
              }}>
              {tab === 'agendar' ? '📅 Agendar Serviço' : '⭐ Avaliar'}
            </button>
          ))}
        </div>

        {activeTab === 'agendar' && (
          <form onSubmit={handleAgendar}>
            {errorAg && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#b91c1c' }}>{errorAg}</div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Pet</label>
              {loadingPets ? (
                <p style={{ fontSize: 13, color: '#9ca3af' }}>Carregando pets...</p>
              ) : (
                <select value={agForm.petId} onChange={e => setAgForm(f => ({ ...f, petId: e.target.value }))} required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}>
                  <option value="">Selecione o pet</option>
                  {pets.length === 0 && <option value="" disabled>Nenhum pet cadastrado</option>}
                  {pets.map(p => <option key={p.id} value={p.id}>{p.nome} ({p.especie})</option>)}
                </select>
              )}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Serviço desejado</label>
              <select value={agForm.servico} onChange={e => setAgForm(f => ({ ...f, servico: e.target.value }))} required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}>
                <option value="">Selecione o serviço</option>
                {servicos.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Data e hora</label>
              <input type="datetime-local" value={agForm.dataHora} onChange={e => setAgForm(f => ({ ...f, dataHora: e.target.value }))} required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" disabled={savingAg || loadingPets}
              style={{ width: '100%', padding: '12px 0', backgroundColor: '#22C55E', color: '#fff', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              {savingAg ? 'Agendando...' : 'Confirmar agendamento'}
            </button>
          </form>
        )}

        {activeTab === 'avaliar' && (
          <form onSubmit={handleAvaliar}>
            {errorAv && (
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#b91c1c' }}>{errorAv}</div>
            )}
            {successAv && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#16a34a' }}>{successAv}</div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Nota</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n} type="button" onClick={() => setAvForm(f => ({ ...f, nota: n }))}
                    style={{ width: 44, height: 44, borderRadius: 8, border: avForm.nota >= n ? 'none' : '1px solid #d1d5db', backgroundColor: avForm.nota >= n ? '#facc15' : '#f9fafb', fontSize: 22, cursor: 'pointer' }}>
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Comentário</label>
              <textarea value={avForm.comentario} onChange={e => setAvForm(f => ({ ...f, comentario: e.target.value }))}
                placeholder="Como foi o atendimento?" rows={3}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" disabled={savingAv}
              style={{ width: '100%', padding: '12px 0', backgroundColor: '#22C55E', color: '#fff', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              {savingAv ? 'Enviando...' : 'Enviar avaliação'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
