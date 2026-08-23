import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, ArrowRight, Building, Calendar, Clock, Mail, MapPin,
  MessageCircle, PawPrint, Phone, Star,
} from 'lucide-react'
import { API_URL } from '../../api/axiosInstance'
import { petService } from '../../api/petService'
import { prestadorService } from '../../api/prestadorService'
import { agendamentoService } from '../../api/agendamentoService'
import { useAuth } from '../../contexts/useAuth'
import type { PrestadorResponseDto, PetResponseDto } from '../../types'
import { BrandLogo } from '../../components/BrandLogo'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Select, Input } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { StarRating } from '../../components/ui/StarRating'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { colors, shadow } from '../../theme/tokens'

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

const container: React.CSSProperties = { maxWidth: 960, margin: '0 auto', padding: '0 20px' }

function BannerPattern() {
  const paws = [
    { left: '4%', top: '18%', size: 46, rotate: -18 },
    { left: '14%', top: '62%', size: 30, rotate: 12 },
    { left: '26%', top: '24%', size: 24, rotate: -6 },
    { left: '38%', top: '70%', size: 38, rotate: 22 },
    { left: '52%', top: '16%', size: 28, rotate: -14 },
    { left: '64%', top: '58%', size: 44, rotate: 8 },
    { left: '78%', top: '22%', size: 32, rotate: -24 },
    { left: '90%', top: '64%', size: 40, rotate: 15 },
    { left: '47%', top: '42%', size: 26, rotate: -10 },
    { left: '8%', top: '88%', size: 26, rotate: 18 },
    { left: '84%', top: '86%', size: 28, rotate: -8 },
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden>
      {paws.map((p, i) => (
        <PawPrint key={i} size={p.size} style={{
          position: 'absolute', left: p.left, top: p.top,
          transform: `rotate(${p.rotate}deg)`,
          color: colors.white, opacity: 0.05,
        }} />
      ))}
    </div>
  )
}

export default function PrestadorPerfilPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, tutorId } = useAuth()

  const [prestador, setPrestador] = useState<PrestadorResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const [pets, setPets] = useState<PetResponseDto[]>([])
  const [loadingPets, setLoadingPets] = useState(true)

  const [agForm, setAgForm] = useState({ petId: '', dataHora: '', servico: '', domicilio: false, endereco: '' })
  const [savingAg, setSavingAg] = useState(false)
  const [errorAg, setErrorAg] = useState('')
  const [successAg, setSuccessAg] = useState(false)

  const agendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    prestadorService.buscarPorId(Number(id))
      .then(setPrestador)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!tutorId) { setPets([]); setLoadingPets(false); return }
    setLoadingPets(true)
    petService.listar()
      .then(data => setPets(data.filter(p => p.tutor?.id === tutorId)))
      .catch(() => {})
      .finally(() => setLoadingPets(false))
  }, [tutorId])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.bg }}>
        <div style={container}>
          <Skeleton height={230} />
          <div style={{ display: 'flex', gap: 16, marginTop: -36, padding: '0 32px' }}>
            <Skeleton width={96} height={96} />
            <div style={{ flex: 1, paddingTop: 44 }}>
              <Skeleton height={24} width={260} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 32 }}>
            <Skeleton height={140} /><Skeleton height={140} />
          </div>
        </div>
      </div>
    )
  }

  if (notFound || !prestador) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.bg }}>
        <div style={{ ...container, paddingTop: 120 }}>
          <EmptyState
            icon={<Building size={28} />}
            title="Profissional não encontrado"
            description="Este perfil não existe ou foi removido."
          >
            <Button variant="secondary" onClick={() => navigate('/tutor/prestadores')}>Voltar para Prestadores</Button>
          </EmptyState>
        </div>
      </div>
    )
  }

  const servicos = prestador.servicos
    ? prestador.servicos.split(',').map(s => s.trim()).filter(Boolean)
    : []

  const handleAgendar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tutorId) { setErrorAg('Faça login novamente.'); return }
    if (!agForm.petId) { setErrorAg('Selecione um pet.'); return }
    if (!agForm.dataHora) { setErrorAg('Informe a data e hora.'); return }
    if (agForm.domicilio && !agForm.endereco.trim()) { setErrorAg('Informe o endereço do atendimento a domicílio.'); return }
    setErrorAg('')
    setSuccessAg(false)
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
        atendimentoDomiciliar: agForm.domicilio || undefined,
        enderecoAtendimento: agForm.domicilio ? agForm.endereco.trim() : undefined,
      })
      setSuccessAg(true)
      setAgForm({ petId: '', dataHora: '', servico: '', domicilio: false, endereco: '' })
    } catch {
      setErrorAg('Erro ao criar agendamento. Verifique se a data é futura.')
    } finally {
      setSavingAg(false)
    }
  }

  const ehTutorLogado = Boolean(tutorId) && user?.role === 'ROLE_TUTOR'

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.bg }}>
      {/* Topbar */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: colors.white, borderBottom: `1px solid ${colors.border}` }}>
        <div style={{ ...container, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, color: colors.gray[600], fontFamily: 'inherit',
              padding: '8px 4px',
            }}
          >
            <ArrowLeft size={17} /> Voltar
          </button>
          <Link to="/" style={{ textDecoration: 'none' }}><BrandLogo size={24} /></Link>
        </div>
      </header>

      {/* Banner */}
      <div style={{
        position: 'relative',
        background: `linear-gradient(135deg, ${colors.brand[900]} 0%, ${colors.brand[950]} 100%)`,
        height: 280,
      }}>
        <BannerPattern />
      </div>

      <main style={container}>
        {/* Cabeçalho sobreposto (só o avatar invade o banner) */}
        <div style={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px 20px', padding: '0 8px', marginTop: -64, marginBottom: 28, position: 'relative' }}>
          <div style={{
            width: 112, height: 112, borderRadius: '50%',
            border: `4px solid ${colors.white}`,
            overflow: 'hidden',
            backgroundColor: colors.brand[100],
            boxShadow: shadow.md,
            flexShrink: 0,
          }}>
            {prestador.fotoUrl ? (
              <img src={`${API_URL}${prestador.fotoUrl}`} alt={prestador.nomePrestador} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building size={40} color={colors.brand[600]} />
              </div>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 280, paddingTop: 72 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: colors.gray[900], margin: '0 0 6px', lineHeight: 1.2 }}>
              {prestador.nomePrestador}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              {prestador.type && <Badge>{tipoLabel[prestador.type] ?? prestador.type}</Badge>}
              {(prestador.cidade || prestador.bairro) && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: colors.gray[500] }}>
                  <MapPin size={13} /> {[prestador.bairro, prestador.cidade].filter(Boolean).join(', ')}
                </span>
              )}
              {prestador.avaliacaoMedia != null && prestador.avaliacaoMedia > 0 && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 600, color: colors.gray[700] }}>
                  <Star size={14} fill="#F59E0B" color="#F59E0B" />
                  {prestador.avaliacaoMedia.toFixed(1)}
                  <StarRating value={Math.round(prestador.avaliacaoMedia)} size={13} />
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', padding: '0 8px', marginBottom: 32 }}>
          <Button onClick={() => agendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
            Agendar serviço <ArrowRight size={15} />
          </Button>
          {prestador.telefone && (
            <a href={whatsappLink(prestador.telefone)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
              <Button variant="secondary"><MessageCircle size={15} color={colors.brand[600]} /> WhatsApp</Button>
            </a>
          )}
          {prestador.telefone && (
            <a href={`tel:${prestador.telefone.replace(/\D/g, '')}`} style={{ textDecoration: 'none' }}>
              <Button variant="secondary"><Phone size={15} color={colors.brand[600]} /> Ligar</Button>
            </a>
          )}
          {prestador.email && (
            <a href={`mailto:${prestador.email}`} style={{ textDecoration: 'none' }}>
              <Button variant="secondary"><Mail size={15} color={colors.brand[600]} /> E-mail</Button>
            </a>
          )}
        </div>

        {/* Corpo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 20, padding: '0 8px' }}>
          <Card padding={24}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: colors.gray[900], margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building size={16} color={colors.brand[600]} /> Sobre
            </h2>
            <p style={{ fontSize: 14, color: colors.gray[600], lineHeight: 1.7, margin: 0 }}>
              {prestador.descricao?.trim() || 'Este profissional ainda não adicionou uma descrição.'}
            </p>
          </Card>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card padding={24}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: colors.gray[900], margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} color={colors.brand[600]} /> Serviços
              </h2>
              {servicos.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {servicos.map(s => <Badge key={s}>{s}</Badge>)}
                </div>
              ) : (
                <p style={{ fontSize: 13.5, color: colors.gray[500], margin: 0 }}>Serviços não informados.</p>
              )}
            </Card>

            <Card padding={24}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: colors.gray[900], margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={16} color={colors.brand[600]} /> Horário de funcionamento
              </h2>
              <p style={{ fontSize: 14, color: colors.gray[600], lineHeight: 1.7, margin: 0 }}>
                {prestador.horarioFuncionamento?.trim() || 'Não informado.'}
              </p>
            </Card>
          </div>

          <Card padding={24}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: colors.gray[900], margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <MapPin size={16} color={colors.brand[600]} /> Localização
            </h2>
            {prestador.cidade || prestador.bairro ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <p style={{ fontSize: 14, color: colors.gray[600], margin: 0 }}>
                  {[prestador.bairro, prestador.cidade].filter(Boolean).join(', ')}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${prestador.nomePrestador} ${prestador.bairro ?? ''} ${prestador.cidade ?? ''}`)}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, fontWeight: 600, color: colors.brand[700], textDecoration: 'none' }}
                >
                  Ver no mapa →
                </a>
              </div>
            ) : (
              <p style={{ fontSize: 13.5, color: colors.gray[500], margin: 0 }}>Localização não informada.</p>
            )}
          </Card>

          {/* Agendar */}
          <div ref={agendarRef} style={{ scrollMarginTop: 80 }}>
            <Card padding={24}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: colors.gray[900], margin: '0 0 18px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={16} color={colors.brand[600]} /> Agendar serviço
              </h2>

              {!ehTutorLogado ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <p style={{ fontSize: 14, color: colors.gray[600], margin: '0 0 16px' }}>
                    Entre na sua conta de tutor para agendar com {prestador.nomePrestador}.
                  </p>
                  <Link to="/login" style={{ textDecoration: 'none' }}>
                    <Button>Entrar</Button>
                  </Link>
                </div>
              ) : (
                <>
                  {successAg && (
                    <div style={{ backgroundColor: colors.success[50], border: `1px solid ${colors.success[100]}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: colors.success[600] }}>
                      Agendamento criado com sucesso! Acompanhe em Agendamentos.
                    </div>
                  )}
                  {errorAg && (
                    <div style={{ backgroundColor: colors.danger[50], border: `1px solid ${colors.danger[100]}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: colors.danger[600] }}>{errorAg}</div>
                  )}
                  <form onSubmit={handleAgendar} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <Select label="Pet" value={agForm.petId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAgForm(f => ({ ...f, petId: e.target.value }))} required disabled={loadingPets}>
                      <option value="">{loadingPets ? 'Carregando...' : 'Selecione um pet'}</option>
                      {pets.map(pet => <option key={pet.id} value={pet.id}>{pet.nome}</option>)}
                    </Select>
                    <Select label="Serviço" value={agForm.servico} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAgForm(f => ({ ...f, servico: e.target.value }))}>
                      <option value="">Selecione um serviço</option>
                      {servicos.map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                    <Input label="Data e hora" type="datetime-local" value={agForm.dataHora} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgForm(f => ({ ...f, dataHora: e.target.value }))} required />
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                      <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 500, color: colors.gray[700], padding: '12px 0' }}>
                        <input
                          type="checkbox"
                          checked={agForm.domicilio}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgForm(f => ({ ...f, domicilio: e.target.checked }))}
                          style={{ width: 16, height: 16, accentColor: colors.brand[600], cursor: 'pointer' }}
                        />
                        Atendimento em domicílio <MapPin size={15} color={colors.brand[600]} />
                      </label>
                    </div>
                    {agForm.domicilio && (
                      <div style={{ gridColumn: '1/-1' }}>
                        <Input
                          label="Endereço do atendimento"
                          value={agForm.endereco}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAgForm(f => ({ ...f, endereco: e.target.value }))}
                          placeholder="Ex.: Rua das Flores, 123 - Centro"
                          maxLength={300}
                        />
                        <p style={{ fontSize: 12, color: colors.gray[500], marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <PawPrint size={12} /> O profissional verá este endereço para ter uma noção da distância.
                        </p>
                      </div>
                    )}
                    <div style={{ gridColumn: '1/-1' }}>
                      <Button type="submit" disabled={savingAg || loadingPets} style={{ width: '100%' }}>
                        {savingAg ? 'Agendando...' : 'Confirmar agendamento'}
                      </Button>
                    </div>
                  </form>
                </>
              )}
            </Card>
          </div>
        </div>

        <div style={{ height: 48 }} />
      </main>
    </div>
  )
}
