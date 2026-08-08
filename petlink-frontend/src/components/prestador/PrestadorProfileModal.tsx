import { useEffect, useState } from 'react'
import { X, MapPin, Clock, Mail, Phone, MessageCircle, Calendar, Star, Building } from 'lucide-react'
import { API_URL } from '../../api/axiosInstance'
import { petService } from '../../api/petService'
import { agendamentoService } from '../../api/agendamentoService'
import { reviewService } from '../../api/reviewService'
import { useAuth } from '../../contexts/AuthContext'
import type { PrestadorResponseDto, PetResponseDto } from '../../types'
import { Button } from '../ui/Button'
import { Select, Input, Textarea } from '../ui/Input'
import { StarRating, StarRatingInput } from '../ui/StarRating'
import { colors, radius, shadow } from '../../theme/tokens'

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

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(15, 23, 42, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: 20,
}

const modalStyle: React.CSSProperties = {
  backgroundColor: colors.white,
  borderRadius: radius.xl,
  width: '100%',
  maxWidth: 560,
  maxHeight: '90vh',
  overflowY: 'auto',
  padding: 32,
  position: 'relative',
  boxShadow: shadow.md,
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
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: colors.gray[400],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 32,
            borderRadius: radius.md,
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
          {prestador.fotoUrl ? (
            <img
              src={`${API_URL}${prestador.fotoUrl}`}
              alt={prestador.nomePrestador}
              style={{ width: 56, height: 56, borderRadius: radius.lg, objectFit: 'cover', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 56, height: 56, borderRadius: radius.lg, backgroundColor: colors.brand[100], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Building size={26} color={colors.brand[600]} />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: colors.gray[900], margin: 0 }}>{prestador.nomePrestador}</h2>
              {prestador.type && (
                <span style={{ fontSize: 11, backgroundColor: colors.brand[100], color: colors.brand[800], padding: '3px 10px', borderRadius: radius.sm, fontWeight: 600 }}>
                  {tipoLabel[prestador.type] ?? prestador.type}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <StarRating value={prestador.avaliacaoMedia ?? 0} />
              <span style={{ fontSize: 13, color: colors.gray[500] }}>({prestador.avaliacaoMedia?.toFixed(1) ?? '—'})</span>
            </div>
          </div>
        </div>

        {prestador.descricao && (
          <p style={{ fontSize: 13, color: colors.gray[500], marginBottom: 12, lineHeight: 1.5 }}>{prestador.descricao}</p>
        )}

        {servicos.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {servicos.map(s => (
              <span key={s} style={{ fontSize: 11, backgroundColor: colors.brand[50], color: colors.brand[800], padding: '3px 10px', borderRadius: radius.sm, fontWeight: 600, border: `1px solid ${colors.border}` }}>
                {s}
              </span>
            ))}
          </div>
        )}

        <div style={{ fontSize: 12, color: colors.gray[500], marginBottom: 4, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {(prestador.cidade || prestador.bairro) && (
            <span><MapPin size={12} /> {[prestador.bairro, prestador.cidade].filter(Boolean).join(', ')}</span>
          )}
          {prestador.horarioFuncionamento && <span><Clock size={12} /> {prestador.horarioFuncionamento}</span>}
        </div>
        <div style={{ fontSize: 12, color: colors.gray[400], marginBottom: 16 }}>
          <span><Mail size={12} /> {prestador.email}</span>
          {prestador.telefone && <span style={{ marginLeft: 16 }}><Phone size={12} /> {prestador.telefone}</span>}
        </div>

        {prestador.telefone && (
          <a href={whatsappLink(prestador.telefone)} target="_blank" rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{ textDecoration: 'none', display: 'block', marginBottom: 20 }}>
            <Button variant="primary" style={{ width: '100%' }}>
              <MessageCircle size={15} /> Falar no WhatsApp
            </Button>
          </a>
        )}

        <div style={{ display: 'flex', borderBottom: `2px solid ${colors.border}`, marginBottom: 20 }}>
          {(['agendar', 'avaliar'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: '12px 0',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab ? `2px solid ${colors.brand[600]}` : '2px solid transparent',
                fontWeight: activeTab === tab ? 700 : 500,
                color: activeTab === tab ? colors.brand[600] : colors.gray[500],
                fontSize: 14,
                cursor: 'pointer',
                marginBottom: -2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontFamily: 'inherit',
              }}
            >
              {tab === 'agendar' ? <><Calendar size={16} /> Agendar Serviço</> : <><Star size={16} /> Avaliar</>}
            </button>
          ))}
        </div>

        {activeTab === 'agendar' && (
          <form onSubmit={handleAgendar}>
            {errorAg && (
              <div style={{ backgroundColor: colors.danger[50], border: `1px solid ${colors.danger[100]}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: colors.danger[600] }}>{errorAg}</div>
            )}
            <Select label="Pet" value={agForm.petId} onChange={e => setAgForm(f => ({ ...f, petId: e.target.value }))} required>
              <option value="">Selecione o pet</option>
              {pets.length === 0 && <option value="" disabled>Nenhum pet cadastrado</option>}
              {pets.map(p => <option key={p.id} value={p.id}>{p.nome} ({p.especie})</option>)}
            </Select>
            <Select label="Serviço desejado" value={agForm.servico} onChange={e => setAgForm(f => ({ ...f, servico: e.target.value }))} required>
              <option value="">Selecione o serviço</option>
              {servicos.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Input label="Data e hora" type="datetime-local" value={agForm.dataHora} onChange={e => setAgForm(f => ({ ...f, dataHora: e.target.value }))} required />
            <Button type="submit" disabled={savingAg || loadingPets} style={{ width: '100%' }}>
              {savingAg ? 'Agendando...' : 'Confirmar agendamento'}
            </Button>
          </form>
        )}

        {activeTab === 'avaliar' && (
          <form onSubmit={handleAvaliar}>
            {errorAv && (
              <div style={{ backgroundColor: colors.danger[50], border: `1px solid ${colors.danger[100]}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: colors.danger[600] }}>{errorAv}</div>
            )}
            {successAv && (
              <div style={{ backgroundColor: colors.success[50], border: `1px solid ${colors.success[100]}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: colors.success[600] }}>{successAv}</div>
            )}
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: colors.gray[700], marginBottom: 8 }}>Nota</label>
            <StarRatingInput value={avForm.nota} onChange={n => setAvForm(f => ({ ...f, nota: n }))} />
            <Textarea
              label="Comentário"
              value={avForm.comentario}
              onChange={e => setAvForm(f => ({ ...f, comentario: e.target.value }))}
              placeholder="Como foi o atendimento?"
              rows={3}
            />
            <Button type="submit" disabled={savingAv} style={{ width: '100%' }}>
              {savingAv ? 'Enviando...' : 'Enviar avaliação'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
