import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../contexts/AuthContext'
import { petService } from '../../api/petService'
import { agendamentoService } from '../../api/agendamentoService'
import { prestadorService } from '../../api/prestadorService'

export default function DashboardTutor() {
  const { user } = useAuth()
  const [counts, setCounts] = useState({ pets: 0, agendamentos: 0, prestadores: 0 })

  useEffect(() => {
    const email = user?.email
    Promise.all([
      petService.listar(),
      agendamentoService.listar(),
      prestadorService.listar(),
    ]).then(([pets, agendamentos, prestadores]) => {
      const meusPets = pets.filter(p => p.tutor?.email === email)
      const meusAgs = agendamentos.filter(a => a.tutor?.email === email)
      setCounts({ pets: meusPets.length, agendamentos: meusAgs.length, prestadores: prestadores.length })
    }).catch(() => {})
  }, [])

  const cards = [
    { label: 'Meus Pets', value: counts.pets, path: '/tutor/pets', cor: '#2563EB', bg: '#eff6ff' },
    { label: 'Agendamentos', value: counts.agendamentos, path: '/tutor/agendamentos', cor: '#16a34a', bg: '#f0fdf4' },
    { label: 'Prestadores', value: counts.prestadores, path: '/tutor/prestadores', cor: '#9333ea', bg: '#faf5ff' },
  ]

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 4 }}>
          Olá, {user?.email?.split('@')[0]} 👋
        </h1>
        <p style={{ color: '#6b7280', fontSize: 15 }}>Bem-vindo ao PetLink. Aqui está um resumo da sua conta.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        {cards.map(card => (
          <Link key={card.label} to={card.path} style={{ textDecoration: 'none' }}>
            <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{card.label}</p>
              <p style={{ fontSize: 36, fontWeight: 800, color: card.cor }}>{card.value}</p>
              <div style={{ marginTop: 12, display: 'inline-block', backgroundColor: card.bg, color: card.cor, fontSize: 12, fontWeight: 600, padding: '4px 10px', borderRadius: 6 }}>
                Ver tudo →
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Ações rápidas</h2>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/tutor/pets" style={{ padding: '10px 20px', backgroundColor: '#2563EB', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            + Adicionar pet
          </Link>
          <Link to="/tutor/prestadores" style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Encontrar prestador
          </Link>
          <Link to="/tutor/agendamentos" style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: 8, fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Ver agendamentos
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
