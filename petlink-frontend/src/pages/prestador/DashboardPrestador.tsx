import { useEffect, useState } from 'react'
import { Calendar, Check, PawPrint, X, MapPin, ExternalLink } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { agendamentoService } from '../../api/agendamentoService'
import { reviewService } from '../../api/reviewService'
import { useAuth } from '../../contexts/useAuth'
import type { AgendamentoResponseDto, ReviewResponseDto } from '../../types'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { SectionHeader } from '../../components/ui/SectionHeader'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { StarRating } from '../../components/ui/StarRating'
import { EmptyState } from '../../components/ui/EmptyState'
import { Skeleton } from '../../components/ui/Skeleton'
import { colors, stateColors, transition } from '../../theme/tokens'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export default function DashboardPrestador() {
  const { user, prestadorId } = useAuth()
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const [agendamentos, setAgendamentos] = useState<AgendamentoResponseDto[]>([])
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([agendamentoService.listar(), reviewService.listar()])
      .then(([ags, rvs]) => {
        setAgendamentos(ags.filter(a => a.prestador?.email === user?.email))
        setReviews(prestadorId ? rvs.filter(r => r.prestadorId === prestadorId) : [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user?.email, prestadorId])

  const mediaAvaliacao = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.nota, 0) / reviews.length).toFixed(1)
    : '—'

  const atualizarStatus = async (id: number, status: string) => {
    try {
      await agendamentoService.atualizarStatus(id, status)
      const ags = await agendamentoService.listar()
      setAgendamentos(ags.filter(a => a.prestador?.email === user?.email))
    } catch {
      alert('Erro ao atualizar status.')
    }
  }

  const formatData = (dt: string) => {
    try { return new Date(dt).toLocaleString('pt-BR') } catch { return dt }
  }

  const resumo = [
    { label: 'Total agendamentos', value: agendamentos.length },
    { label: 'Aguardando confirmação', value: agendamentos.filter(a => a.status === 'AGENDADO').length },
    { label: 'Avaliação média', value: mediaAvaliacao },
  ]

  return (
    <DashboardLayout>
      <PageHeader
        title={<>Olá, {user?.email?.split('@')[0]} <PawPrint size={22} color={colors.brand[600]} style={{ verticalAlign: 'middle' }} /></>}
        subtitle="Aqui está o resumo dos seus atendimentos."
      />

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.6fr 1fr', gap: 24, alignItems: 'start' }}>
        <Card padding={24}>
          <SectionHeader title="Minha agenda" />
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} height={56} />)}
            </div>
          ) : agendamentos.length === 0 ? (
            <EmptyState
              icon={<Calendar size={26} />}
              title="Nenhum agendamento recebido ainda"
              description="Quando um tutor agendar um serviço com você, ele aparecerá aqui."
            />
          ) : (
            <div>
              {agendamentos.map((a) => (
                <div key={a.id} style={{ padding: '14px 10px', borderRadius: 8, marginBottom: 4, transition, cursor: 'pointer' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.gray[50] }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: colors.gray[900], margin: 0 }}>{a.tutor?.nome}</p>
                    <StatusBadge status={a.status} />
                  </div>
                  <p style={{ fontSize: 13, color: colors.gray[500], margin: 0 }}>
                    <PawPrint size={13} /> {a.pet?.nome} ({a.pet?.especie}) • <Calendar size={13} /> {formatData(a.dataHora)}
                  </p>
                  {a.atendimentoDomiciliar && a.enderecoAtendimento && (
                    <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 8, backgroundColor: colors.brand[50], border: `1px solid ${colors.brand[100]}`, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <MapPin size={14} color={colors.brand[600]} />
                      <span style={{ fontSize: 12.5, color: colors.gray[700], fontWeight: 600 }}>Domicílio:</span>
                      <span style={{ fontSize: 12.5, color: colors.gray[600] }}>{a.enderecoAtendimento}</span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a.enderecoAtendimento)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: colors.brand[700], textDecoration: 'none' }}
                      >
                        Ver no mapa <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                  {a.status === 'AGENDADO' && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <Button size="sm" onClick={() => atualizarStatus(a.id, 'CONFIRMADO')}><Check size={14} /> Confirmar</Button>
                      <Button size="sm" variant="secondary" onClick={() => atualizarStatus(a.id, 'CANCELADO')}><X size={14} /> Cancelar</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

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
                  const sc = [stateColors.info, stateColors.warning, stateColors.success][i]
                  return (
                    <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: 8, backgroundColor: sc.bg, border: `1px solid ${sc.border}`, transition }}>
                      <span style={{ fontSize: 14, fontWeight: 500, color: sc.text }}>{r.label}</span>
                      <span style={{ fontSize: 22, fontWeight: 800, color: sc.text }}>{r.value}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>

          {reviews.length > 0 && (
            <Card padding={24}>
              <SectionHeader title="Avaliações recebidas" />
              <div>
                {reviews.slice(0, 4).map((r) => (
                  <div key={r.id} style={{ padding: '12px 10px', borderRadius: 8, marginBottom: 4, transition, cursor: 'default' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.backgroundColor = colors.gray[50] }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: colors.gray[700], margin: 0 }}>{r.tutorNome}</p>
                      <StarRating value={r.nota} size={13} />
                    </div>
                    {r.comentario && <p style={{ fontSize: 13, color: colors.gray[500], margin: 0 }}>{r.comentario}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
