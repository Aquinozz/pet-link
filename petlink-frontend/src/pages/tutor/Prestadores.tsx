import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { prestadorService } from '../../api/prestadorService'
import type { PrestadorResponseDto } from '../../types'

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

  useEffect(() => {
    prestadorService.listar().then(setPrestadores).catch(() => {}).finally(() => setLoading(false))
  }, [])

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

  const stars = (n: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < Math.round(n) ? '#facc15' : '#e5e7eb', fontSize: 14 }}>★</span>
    ))

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 4 }}>Prestadores</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>{prestadores.length} profissional(is) disponível(is)</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={busca} onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome..."
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, minWidth: 220 }} />
        <input value={cidadeFiltro} onChange={e => setCidadeFiltro(e.target.value)}
          placeholder="Cidade"
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, minWidth: 160 }} />
        <input value={bairroFiltro} onChange={e => setBairroFiltro(e.target.value)}
          placeholder="Bairro"
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, minWidth: 160 }} />
        <select value={servicoFiltro} onChange={e => setServicoFiltro(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, minWidth: 200 }}>
          <option value="">Todos os serviços</option>
          {todosServicos.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button type="button" onClick={handleAplicarFiltros}
          style={{ padding: '10px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', minWidth: 160 }}>
          Aplicar filtros
        </button>
      </div>

      {loading ? <p style={{ color: '#6b7280' }}>Carregando...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtrados.map(p => (
            <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🏥</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{p.nomePrestador}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 2 }}>{stars(p.avaliacaoMedia ?? 0)}</div>
                    {p.type && (
                      <span style={{ fontSize: 11, backgroundColor: '#eff6ff', color: '#2563EB', padding: '2px 8px', borderRadius: 6, fontWeight: 600 }}>
                        {tipoLabel[p.type] ?? p.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {p.descricao && <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 10 }}>{p.descricao}</p>}

              {p.servicos && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {p.servicos.split(',').map(s => s.trim()).filter(Boolean).map(s => (
                    <span key={s} style={{ fontSize: 11, backgroundColor: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: 20, fontWeight: 600, border: '1px solid #bbf7d0' }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}

              {(p.cidade || p.bairro) && (
                <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 10 }}>
                  📍 {[p.bairro, p.cidade].filter(Boolean).join(', ')}
                </p>
              )}

              {p.horarioFuncionamento && (
                <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 10 }}>🕐 {p.horarioFuncionamento}</p>
              )}
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 12 }}>📧 {p.email}</p>

              {p.telefone && (
                <a href={whatsappLink(p.telefone)} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', padding: '10px 0', backgroundColor: '#22c55e', color: '#fff', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                  💬 Falar no WhatsApp
                </a>
              )}
            </div>
          ))}
          {filtrados.length === 0 && (
            <p style={{ color: '#6b7280', gridColumn: '1/-1' }}>Nenhum prestador encontrado.</p>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
