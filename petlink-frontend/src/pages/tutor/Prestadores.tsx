import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Clock, MessageCircle, Building, Navigation, ChevronRight, Search } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { EmptyState } from '../../components/ui/EmptyState'
import { API_URL } from '../../api/axiosInstance'
import { prestadorService } from '../../api/prestadorService'
import type { PrestadorResponseDto } from '../../types'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Input'
import { Badge } from '../../components/ui/Badge'
import { StarRating } from '../../components/ui/StarRating'
import { Skeleton } from '../../components/ui/Skeleton'
import { useHover } from '../../components/ui/useHover'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { colors, radius, shadow } from '../../theme/tokens'

const whatsappLink = (tel: string) =>
  `https://api.whatsapp.com/send?phone=55${tel.replace(/\D/g, '')}&text=${encodeURIComponent('Olá! Vi seu perfil no PetLink e gostaria de agendar um serviço.')}`

const tipoLabel: Record<string, string> = {
  CLINICA_VETERINARIA: 'Clínica Veterinária',
  VETERINARIO: 'Veterinário',
  PETSHOP: 'Pet Shop',
  PASSEADOR: 'Passeador',
  CRECHE_PET: 'Creche Pet',
  BANHO_E_TOSA: 'Banho e Tosa',
  PET_SITTER: 'Pet Sitter',
}

function PrestadorRow({ prestador: p, onOpen }: { prestador: PrestadorResponseDto; onOpen: () => void }) {
  const { hovered, onMouseEnter, onMouseLeave } = useHover()
  const isMobile = useIsMobile()

  return (
    <div
      onClick={onOpen}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') onOpen() }}
      style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 20,
        backgroundColor: colors.white,
        borderRadius: radius.xl,
        border: `1px solid ${hovered ? colors.brand[400] : colors.border}`,
        boxShadow: hovered ? shadow.md : shadow.sm,
        transform: hovered ? 'translateY(-2px)' : 'none',
        transition: 'box-shadow 0.18s ease, border-color 0.18s ease, transform 0.18s ease',
        padding: isMobile ? 14 : 20,
        cursor: 'pointer',
      }}
    >
      {p.fotoUrl ? (
        <img src={`${API_URL}${p.fotoUrl}`} alt={p.nomePrestador}
          style={{ width: isMobile ? 72 : 110, height: isMobile ? 72 : 110, borderRadius: radius.lg, objectFit: 'cover', flexShrink: 0 }}
        />
      ) : (
        <div style={{
          width: isMobile ? 72 : 110, height: isMobile ? 72 : 110, borderRadius: radius.lg, backgroundColor: colors.brand[100],
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Building size={isMobile ? 28 : 40} color={colors.brand[600]} />
        </div>
      )}

      <div style={{ flex: 1, minWidth: isMobile ? 0 : 260 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: colors.gray[900], margin: 0 }}>{p.nomePrestador}</p>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <StarRating value={p.avaliacaoMedia ?? 0} />
            {p.avaliacaoMedia != null && p.avaliacaoMedia > 0 && (
              <span style={{ fontSize: 13, fontWeight: 700, color: colors.gray[600] }}>{p.avaliacaoMedia.toFixed(1)}</span>
            )}
          </span>
          {p.type && <Badge tone="green">{tipoLabel[p.type] ?? p.type}</Badge>}
        </div>

        {p.descricao && (
          <p style={{
            fontSize: 14, color: colors.gray[500], lineHeight: 1.55, margin: '0 0 10px',
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {p.descricao}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', marginBottom: p.servicos ? 10 : 0 }}>
          {(p.cidade || p.bairro) && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: colors.gray[500] }}>
              <MapPin size={13} /> {[p.bairro, p.cidade].filter(Boolean).join(', ')}
              {p.distanciaKm != null && <b style={{ color: colors.brand[600], marginLeft: 4 }}>{p.distanciaKm} km</b>}
            </span>
          )}
          {!p.cidade && !p.bairro && p.distanciaKm != null && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: colors.brand[600] }}>
              <MapPin size={13} /> {p.distanciaKm} km de distância
            </span>
          )}
          {p.horarioFuncionamento && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, color: colors.gray[500] }}>
              <Clock size={13} /> {p.horarioFuncionamento}
            </span>
          )}
        </div>

        {p.servicos && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {p.servicos.split(',').map(s => s.trim()).filter(Boolean).slice(0, 5).map(s => (
              <span key={s} style={{ fontSize: 11.5, backgroundColor: colors.brand[50], color: colors.brand[800], padding: '3px 10px', borderRadius: 20, fontWeight: 600, border: `1px solid ${colors.border}` }}>
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      <div onClick={e => e.stopPropagation()} style={isMobile
        ? { display: 'flex', gap: 8, width: '100%' }
        : { display: 'flex', flexDirection: 'column', gap: 8, width: 168, flexShrink: 0 }}
      >
        <Button onClick={onOpen} style={isMobile ? { flex: 1 } : undefined}>Ver perfil <ChevronRight size={15} /></Button>
        {p.telefone && (
          <a href={whatsappLink(p.telefone)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', flex: isMobile ? 1 : undefined }}>
            <Button variant="secondary" style={{ width: isMobile ? '100%' : undefined }}><MessageCircle size={14} /> WhatsApp</Button>
          </a>
        )}
      </div>
    </div>
  )
}

export default function Prestadores() {
  const [prestadores, setPrestadores] = useState<PrestadorResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [servicoFiltro, setServicoFiltro] = useState('')
  const [cidadeFiltro, setCidadeFiltro] = useState('')
  const [bairroFiltro, setBairroFiltro] = useState('')
  const [filtrosAplicados, setFiltrosAplicados] = useState({ busca: '', servico: '', cidade: '', bairro: '' })

  const navigate = useNavigate()
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [raio, setRaio] = useState(50)
  const [usarLocalizacao, setUsarLocalizacao] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState('')

  useEffect(() => {
    prestadorService.listar().then(setPrestadores).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleUsarLocalizacao = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocalização não disponível neste navegador')
      return
    }
    setLocationLoading(true)
    setLocationError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setUsarLocalizacao(true)
        setLocationLoading(false)
      },
      () => {
        setLocationError('Não foi possível obter sua localização')
        setLocationLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  useEffect(() => {
    if (usarLocalizacao && userLocation) {
      setLoading(true)
      prestadorService.listarProximos(userLocation.lat, userLocation.lng, raio)
        .then(setPrestadores)
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [usarLocalizacao, userLocation, raio])

  const todosServicos = Array.from(new Set(
    prestadores.flatMap(p => p.servicos ? p.servicos.split(',').map(s => s.trim()) : [])
  )).filter(Boolean)

  const filtrados = prestadores.filter(p => {
    const matchBusca = !filtrosAplicados.busca || p.nomePrestador.toLowerCase().includes(filtrosAplicados.busca.toLowerCase())
    const matchServico = !filtrosAplicados.servico || (p.servicos && p.servicos.toLowerCase().includes(filtrosAplicados.servico.toLowerCase()))
    const matchCidade = !filtrosAplicados.cidade || (p.cidade && p.cidade.toLowerCase().includes(filtrosAplicados.cidade.toLowerCase()))
    const matchBairro = !filtrosAplicados.bairro || (p.bairro && p.bairro.toLowerCase().includes(filtrosAplicados.bairro.toLowerCase()))
    return matchBusca && matchServico && matchCidade && matchBairro
  })

  const handleAplicarFiltros = () => {
    setFiltrosAplicados({
      busca,
      servico: servicoFiltro,
      cidade: cidadeFiltro,
      bairro: bairroFiltro,
    })
  }

  return (
    <DashboardLayout>
      <PageHeader title="Prestadores" subtitle={`${prestadores.length} profissional(is) disponível(is)`} />

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <Input noMargin value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar por nome..." style={{ minWidth: 220, width: 'auto', height: 40 }} />
        <Input noMargin value={cidadeFiltro} onChange={e => setCidadeFiltro(e.target.value)} placeholder="Cidade" style={{ minWidth: 160, width: 'auto', height: 40 }} />
        <Input noMargin value={bairroFiltro} onChange={e => setBairroFiltro(e.target.value)} placeholder="Bairro" style={{ minWidth: 160, width: 'auto', height: 40 }} />
        <Select noMargin value={servicoFiltro} onChange={e => setServicoFiltro(e.target.value)} style={{ minWidth: 200, width: 'auto', height: 40 }}>
          <option value="">Todos os serviços</option>
          {todosServicos.map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
        <Button onClick={handleAplicarFiltros} style={{ height: 40 }}>Aplicar filtros</Button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <Button variant={usarLocalizacao ? 'secondary' : 'primary'} onClick={handleUsarLocalizacao} disabled={locationLoading}>
          <Navigation size={15} />
          {locationLoading ? 'Obtendo localização...' : usarLocalizacao ? 'Localização ativada' : 'Usar minha localização'}
        </Button>
        {usarLocalizacao && (
          <>
            <label style={{ fontSize: 14, color: colors.gray[700], display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>Raio:</span>
              <Select value={raio} onChange={e => setRaio(Number(e.target.value))} style={{ width: 110, marginBottom: 0 }}>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
                <option value={25}>25 km</option>
                <option value={50}>50 km</option>
                <option value={100}>100 km</option>
              </Select>
            </label>
            <Button variant="secondary" onClick={() => { setUsarLocalizacao(false); setUserLocation(null); prestadorService.listar().then(setPrestadores) }}>Limpar</Button>
          </>
        )}
        {locationError && <span style={{ fontSize: 13, color: colors.danger[600] }}>{locationError}</span>}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding={20}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <Skeleton width={110} height={110} style={{ flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                    <Skeleton width="30%" height={18} />
                    <Skeleton width={90} height={18} />
                  </div>
                  <Skeleton width="70%" height={13} style={{ marginBottom: 8 }} />
                  <Skeleton width="45%" height={12} />
                </div>
                <Skeleton width={168} height={76} style={{ flexShrink: 0 }} />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filtrados.map(p => (
            <PrestadorRow key={p.id} prestador={p} onOpen={() => navigate(`/prestadores/${p.id}`)} />
          ))}
          {filtrados.length === 0 && (
            <EmptyState
              icon={<Search size={26} />}
              title="Nenhum prestador encontrado"
              description="Tente outro termo de busca ou limpe os filtros para ver todos."
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setBusca('')
                  setServicoFiltro('')
                  setCidadeFiltro('')
                  setBairroFiltro('')
                  setFiltrosAplicados({ busca: '', servico: '', cidade: '', bairro: '' })
                }}
              >
                Limpar filtros
              </Button>
            </EmptyState>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
