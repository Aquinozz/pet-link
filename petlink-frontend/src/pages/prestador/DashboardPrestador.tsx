import { useEffect, useState } from 'react'
import { Calendar, Check, PawPrint, X } from 'lucide-react'
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
import { colors } from '../../theme/tokens'
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
              {agendamentos.map((a, i) => (
                <div key={a.id} style={{ padding: '16px 0', borderBottom: i < agendamentos.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: colors.gray[900] }}>{a.tutor?.nome}</p>
                    <StatusBadge status={a.status} />
                  </div>
                  <p style={{ fontSize: 13, color: colors.gray[500], margin: 0 }}>
                    <PawPrint size={13} /> {a.pet?.nome} ({a.pet?.especie}) • <Calendar size={13} /> {formatData(a.dataHora)}
                  </p>
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
              <div>
                {resumo.map((r, i) => (
                  <div key={r.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: i < resumo.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
                    <span style={{ fontSize: 14, color: colors.gray[500] }}>{r.label}</span>
                    <span style={{ fontSize: 18, fontWeight: 800, color: colors.brand[700] }}>{r.value}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {reviews.length > 0 && (
            <Card padding={24}>
              <SectionHeader title="Avaliações recebidas" />
              <div>
                {reviews.slice(0, 4).map((r, i) => (
                  <div key={r.id} style={{ padding: '13px 0', borderBottom: i < Math.min(reviews.length, 4) - 1 ? `1px solid ${colors.border}` : 'none' }}>
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
