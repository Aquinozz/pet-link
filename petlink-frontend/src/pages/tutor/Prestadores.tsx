import { useEffect, useState } from 'react'
import { MapPin, Clock, Mail, MessageCircle, Building, Navigation } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import PrestadorProfileModal from '../../components/prestador/PrestadorProfileModal'
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
import { colors, radius } from '../../theme/tokens'

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

export default function Prestadores() {
  const [prestadores, setPrestadores] = useState<PrestadorResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [servicoFiltro, setServicoFiltro] = useState('')
  const [cidadeFiltro, setCidadeFiltro] = useState('')
  const [bairroFiltro, setBairroFiltro] = useState('')
  const [filtrosAplicados, setFiltrosAplicados] = useState({ busca: '', servico: '', cidade: '', bairro: '' })

  const [prestadorSelecionado, setPrestadorSelecionado] = useState<PrestadorResponseDto | null>(null)
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} padding={24}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                <Skeleton width={48} height={48} style={{ borderRadius: radius.lg, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <Skeleton width="70%" height={15} style={{ marginBottom: 8 }} />
                  <Skeleton width="45%" height={12} />
                </div>
              </div>
              <Skeleton width="100%" height={13} style={{ marginBottom: 8 }} />
              <Skeleton width="80%" height={13} style={{ marginBottom: 16 }} />
              <Skeleton height={36} style={{ borderRadius: radius.md }} />
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtrados.map(p => (
            <Card key={p.id} hoverable onClick={() => setPrestadorSelecionado(p)} padding={24}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                {p.fotoUrl ? (
                  <img src={`${API_URL}${p.fotoUrl}`} alt={p.nomePrestador}
                    style={{ width: 48, height: 48, borderRadius: radius.lg, objectFit: 'cover', flexShrink: 0 }}
                  />
                ) : (
                  <div style={{ width: 48, height: 48, borderRadius: radius.lg, backgroundColor: colors.brand[100], display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Building size={22} color={colors.brand[600]} />
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: colors.gray[900], marginBottom: 4 }}>{p.nomePrestador}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <StarRating value={p.avaliacaoMedia ?? 0} />
                    {p.type && (
                      <Badge tone="green">{tipoLabel[p.type] ?? p.type}</Badge>
                    )}
                  </div>
                </div>
              </div>

              {p.descricao && <p style={{ fontSize: 13, color: colors.gray[500], marginBottom: 10 }}>{p.descricao}</p>}

              {p.servicos && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {p.servicos.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                    <span key={s} style={{ fontSize: 11, backgroundColor: colors.brand[50], color: colors.brand[800], padding: '3px 10px', borderRadius: 20, fontWeight: 600, border: `1px solid ${colors.border}` }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {(p.cidade || p.bairro) && (
                <p style={{ fontSize: 12, color: colors.gray[400], marginBottom: 10 }}>
                  <MapPin size={12} /> {[p.bairro, p.cidade].filter(Boolean).join(', ')}
                  {p.distanciaKm != null && <span style={{ color: colors.brand[600], fontWeight: 600, marginLeft: 8 }}>{p.distanciaKm} km</span>}
                </p>
              )}
              {!p.cidade && !p.bairro && p.distanciaKm != null && (
                <p style={{ fontSize: 12, color: colors.brand[600], fontWeight: 600, marginBottom: 10 }}>
                  <MapPin size={12} /> {p.distanciaKm} km de distância
                </p>
              )}

              {p.horarioFuncionamento && (
                <p style={{ fontSize: 12, color: colors.gray[500], marginBottom: 10 }}><Clock size={12} /> {p.horarioFuncionamento}</p>
              )}
              <p style={{ fontSize: 12, color: colors.gray[400], marginBottom: 12 }}><Mail size={12} /> {p.email}</p>

              {p.telefone && (
                <a href={whatsappLink(p.telefone)} target="_blank" rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ textDecoration: 'none', display: 'block' }}>
                  <Button style={{ width: '100%' }}><MessageCircle size={15} /> Falar no WhatsApp</Button>
                </a>
              )}
            </Card>
          ))}
          {filtrados.length === 0 && (
            <p style={{ color: colors.gray[500], gridColumn: '1/-1' }}>Nenhum prestador encontrado.</p>
          )}
        </div>
      )}
      {prestadorSelecionado && (
        <PrestadorProfileModal
          prestador={prestadorSelecionado}
          onClose={() => setPrestadorSelecionado(null)}
          onSuccess={() => {
            prestadorService.listar().then(setPrestadores).catch(() => {})
          }}
        />
      )}
    </DashboardLayout>
  )
}
