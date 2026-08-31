import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, PawPrint } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../contexts/useAuth'
import { petService } from '../../api/petService'
import { agendamentoService } from '../../api/agendamentoService'
import { prestadorService } from '../../api/prestadorService'
import type { PetResponseDto, AgendamentoResponseDto, PrestadorResponseDto } from '../../types'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { TextLink } from '../../components/ui/TextLink'
import { EspecieIcon } from '../../components/ui/EspecieIcon'
import { Skeleton } from '../../components/ui/Skeleton'
import { EmptyState } from '../../components/ui/EmptyState'
import { StarRating } from '../../components/ui/StarRating'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { colors, stateColors, shadow, transition } from '../../theme/tokens'
import { useMediaQuery } from '../../hooks/useMediaQuery'

const formatData = (dt: string) => {
  try { return new Date(dt).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) } catch { return dt }
}

export default function DashboardTutor() {
  const { user } = useAuth()
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const [pets, setPets] = useState<PetResponseDto[]>([])
  const [agendamentos, setAgendamentos] = useState<AgendamentoResponseDto[]>([])
  const [prestadores, setPrestadores] = useState<PrestadorResponseDto[]>([])
  const [topAvaliados, setTopAvaliados] = useState<PrestadorResponseDto[]>([])
  const [loading, setLoading] = useState(true)

  const proximos = agendamentos
    .filter(a => ['AGENDADO', 'CONFIRMADO'].includes(a.status))
    .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime())
    .slice(0, 3)

  const resumo = [
    { label: 'Pets cadastrados', value: pets.length, to: '/tutor/pets' },
    { label: 'Agendamentos', value: agendamentos.length, to: '/tutor/agendamentos' },
    { label: 'Prestadores disponíveis', value: prestadores.length, to: '/tutor/prestadores' },
  ]

  useEffect(() => {
    const email = user?.email
    Promise.all([
      petService.listar(),
      agendamentoService.listar(),
      prestadorService.listar(),
      prestadorService.listarTopAvaliados(10),
    ]).then(([petsData, agsData, prsData, topData]) => {
      setPets(petsData.filter(p => p.tutor?.email === email))
      setAgendamentos(agsData.filter(a => a.tutor?.email === email))
      setPrestadores(prsData)
      setTopAvaliados(topData)
    }).catch((err) => {
      console.error('[DashboardTutor] erro ao carregar dados:', err)
    }).finally(() => setLoading(false))
  }, [user?.email])

  return (
    <DashboardLayout>
      <PageHeader
        title={<>Olá, {user?.email?.split('@')[0]} <PawPrint size={22} color={colors.brand[600]} style={{ verticalAlign: 'middle' }} /></>}
        subtitle="Bem-vindo ao Zoop. Acompanhe seus próximos passos por aqui."
      />

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: 24, alignItems: 'start' }}>
        <div>
          <Card padding={24} style={{ marginBottom: 24 }}>
            <SectionHeader
              title="Próximos agendamentos"
              action={agendamentos.length > 0 ? <TextLink to="/tutor/agendamentos">Ver todos</TextLink> : undefined}
            />
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={40} />)}
              </div>
            ) : proximos.length === 0 ? (
              <EmptyState
                icon={<Calendar size={26} />}
                title="Nenhum agendamento por aqui"
                description="Encontre um prestador e agende o próximo cuidado do seu pet."
              >
                <Link to="/tutor/prestadores" style={{ textDecoration: 'none' }}>
                  <Button size="sm">Encontrar prestador</Button>
                </Link>
              </EmptyState>
            ) : (
              <div>
                {proximos.map((a) => (
                  <Link key={a.id} to="/tutor/agendamentos" style={{ textDecoration: 'none', display: 'block', padding: '12px 10px', borderRadius: 8, marginBottom: 4, transition, cursor: 'pointer' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.gray[50] }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: colors.gray[900], margin: 0 }}>{a.prestador?.nomePrestador}</p>
                      <StatusBadge status={a.status} />
                    </div>
                    <p style={{ fontSize: 13, color: colors.gray[500], margin: 0 }}>
                      <PawPrint size={13} /> {a.pet?.nome} • <Calendar size={13} /> {formatData(a.dataHora)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card padding={24} style={{ marginBottom: 24 }}>
            <SectionHeader title="Seus pets" action={pets.length > 0 ? <TextLink to="/tutor/pets">Gerenciar</TextLink> : undefined} />
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} height={40} />)}
              </div>
            ) : pets.length === 0 ? (
              <EmptyState
                icon={<PawPrint size={26} />}
                title="Cadastre seu primeiro pet"
                description="Adicione nome, espécie e raça para facilitar os agendamentos."
              >
                <Link to="/tutor/pets" style={{ textDecoration: 'none' }}>
                  <Button size="sm">Adicionar pet</Button>
                </Link>
              </EmptyState>
            ) : (
              <div>
                {pets.slice(0, 3).map((p) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px', borderRadius: 8, marginBottom: 4, transition, cursor: 'pointer' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.gray[50] }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.brand[50], display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.brand[600], flexShrink: 0 }}>
                      <EspecieIcon especie={p.especie} size={20} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: colors.gray[900], margin: 0 }}>{p.nome}</p>
                      <p style={{ fontSize: 12, color: colors.gray[500], margin: 0 }}>{p.especie} • {p.raca}</p>
                    </div>
                  </div>
                ))}
                {pets.length > 3 && (
                  <TextLink to="/tutor/pets">Ver todos os {pets.length} pets</TextLink>
                )}
              </div>
            )}
          </Card>

          <div>
            <SectionHeader title="Ações rápidas" />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/tutor/pets" style={{ textDecoration: 'none' }}>
                <Button>+ Adicionar pet</Button>
              </Link>
              <Link to="/tutor/prestadores" style={{ textDecoration: 'none' }}>
                <Button variant="secondary">Encontrar prestador</Button>
              </Link>
              <Link to="/tutor/agendamentos" style={{ textDecoration: 'none' }}>
                <Button variant="secondary">Ver agendamentos</Button>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <Card padding={24} style={{ marginBottom: 24 }}>
            <SectionHeader title="Resumo" />
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={32} />)}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {resumo.map((r, i) => {
                  const sc = [stateColors.success, stateColors.info, stateColors.warning][i]
                  return (
                    <Link key={r.label} to={r.to} style={{ textDecoration: 'none', display: 'block' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 8, backgroundColor: sc.bg, border: `1px solid ${sc.border}`, transition, cursor: 'pointer' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = shadow.sm }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: sc.text }}>{r.label}</span>
                        <span style={{ fontSize: 22, fontWeight: 800, color: sc.text }}>{r.value}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </Card>

          {topAvaliados.length > 0 && (
            <Card padding={24} style={{ marginBottom: 24 }}>
              <SectionHeader title="Top 10 melhores avaliados" action={<TextLink to="/tutor/prestadores">Ver todos</TextLink>} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {topAvaliados.map((p, idx) => (
                  <Link key={p.id} to={`/tutor/prestadores/${p.id}`} style={{ textDecoration: 'none', display: 'block', padding: '8px 12px', borderRadius: 8, transition, cursor: 'pointer', backgroundColor: colors.white, border: `1px solid ${colors.border}` }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = shadow.sm; (e.currentTarget as HTMLElement).style.borderColor = colors.brand[300] }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.borderColor = colors.border }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: colors.brand[100], display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.brand[700], fontWeight: 'bold', fontSize: 12, flexShrink: 0 }}>{idx + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <p style={{ fontSize: 14, fontWeight: 'bold', color: colors.gray[900], margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nomePrestador}</p>
                          <StarRating value={Math.round(p.avaliacaoMedia || 0)} size={12} />
                          <span style={{ fontSize: 12, color: colors.gray[500] }}>{p.avaliacaoMedia?.toFixed(1)}</span>
                        </div>
                        <p style={{ fontSize: 12, color: colors.gray[500], margin: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.cidade} - {p.bairro}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}