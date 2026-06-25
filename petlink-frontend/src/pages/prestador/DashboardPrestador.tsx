import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { agendamentoService } from '../../api/agendamentoService'
import { reviewService } from '../../api/reviewService'
import { useAuth } from '../../contexts/AuthContext'
import type { AgendamentoResponseDto, ReviewResponseDto } from '../../types'

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  AGENDADO: { bg: '#eff6ff', color: '#2563EB', label: 'Agendado' },
  CONFIRMADO: { bg: '#f0fdf4', color: '#16a34a', label: 'Confirmado' },
  FINALIZADO: { bg: '#f3f4f6', color: '#374151', label: 'Finalizado' },
  CANCELADO: { bg: '#fef2f2', color: '#b91c1c', label: 'Cancelado' },
}

export default function DashboardPrestador() {
  const { user, prestadorId } = useAuth()
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

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
          Olá, {user?.email?.split('@')[0]} 👋
        </h1>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Aqui está o resumo dos seus atendimentos.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Total agendamentos', value: agendamentos.length, cor: '#2563EB' },
          { label: 'Aguardando', value: agendamentos.filter(a => a.status === 'AGENDADO').length, cor: '#d97706' },
          { label: 'Avaliação média', value: mediaAvaliacao, cor: '#16a34a' },
        ].map(card => (
          <div key={card.label} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb' }}>
            <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{card.label}</p>
            <p style={{ fontSize: 36, fontWeight: 800, color: card.cor }}>{card.value}</p>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 20 }}>Minha agenda</h2>
        {loading ? <p style={{ color: '#6b7280' }}>Carregando...</p> : agendamentos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p style={{ fontSize: 40, marginBottom: 8 }}>📅</p>
            <p style={{ fontSize: 15, color: '#6b7280' }}>Nenhum agendamento recebido ainda.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {agendamentos.map(a => {
              const st = statusStyle[a.status] ?? { bg: '#f3f4f6', color: '#374151', label: a.status }
              return (
                <div key={a.id} style={{ padding: 16, borderRadius: 12, border: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{a.tutor?.nome}</p>
                      <span style={{ fontSize: 11, fontWeight: 600, backgroundColor: st.bg, color: st.color, padding: '2px 8px', borderRadius: 6 }}>{st.label}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#6b7280' }}>🐾 {a.pet?.nome} ({a.pet?.especie}) • 📅 {formatData(a.dataHora)}</p>
                    {a.status === 'AGENDADO' && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button onClick={() => atualizarStatus(a.id, 'CONFIRMADO')}
                          style={{ padding: '6px 14px', backgroundColor: '#16a34a', color: '#fff', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          ✓ Confirmar
                        </button>
                        <button onClick={() => atualizarStatus(a.id, 'CANCELADO')}
                          style={{ padding: '6px 14px', backgroundColor: '#fef2f2', color: '#b91c1c', borderRadius: 6, border: '1px solid #fecaca', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                          ✗ Cancelar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {reviews.length > 0 && (
        <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb', marginTop: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Avaliações recebidas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {reviews.map(r => (
              <div key={r.id} style={{ padding: 16, borderRadius: 12, border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{r.tutorNome}</p>
                  <div>{Array.from({ length: r.nota }, (_, i) => <span key={i} style={{ color: '#facc15' }}>★</span>)}</div>
                </div>
                {r.comentario && <p style={{ fontSize: 13, color: '#6b7280' }}>{r.comentario}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
