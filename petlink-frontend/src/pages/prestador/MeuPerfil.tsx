import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { authService } from '../../api/authService'
import { prestadorService } from '../../api/prestadorService'
import type { MeResponse } from '../../api/authService'

export default function MeuPerfil() {
  const [perfil, setPerfil] = useState<MeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [novoServico, setNovoServico] = useState('')
  const [form, setForm] = useState({
    telefone: '', descricao: '', cidade: '', bairro: '', servicos: '', horarioFuncionamento: '',
  })

  useEffect(() => {
    authService.me().then(me => {
      setPerfil(me)
      setForm({
        telefone: me.telefone ?? '',
        descricao: me.descricao ?? '',
        cidade: me.cidade ?? '',
        bairro: me.bairro ?? '',
        servicos: me.servicos ?? '',
        horarioFuncionamento: me.horarioFuncionamento ?? '',
      })
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const servicos = form.servicos ? form.servicos.split(',').map(s => s.trim()).filter(Boolean) : []

  const adicionarServico = () => {
    if (!novoServico.trim()) return
    const novo = [...servicos, novoServico.trim()].join(', ')
    setForm(f => ({ ...f, servicos: novo }))
    setNovoServico('')
  }

  const removerServico = (servico: string) => {
    const novo = servicos.filter(s => s !== servico).join(', ')
    setForm(f => ({ ...f, servicos: novo }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    try {
      await prestadorService.atualizarPerfil(form)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch {
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><p style={{ color: '#6b7280' }}>Carregando...</p></DashboardLayout>

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>Meu Perfil</h1>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Gerencie suas informações e serviços oferecidos</p>
        {perfil && (
          <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{perfil.nome} • {perfil.email}</p>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 20 }}>Informações do perfil</h2>
          <form onSubmit={handleSave}>
            {[
              { field: 'telefone', label: 'Telefone', placeholder: '71 99999-9999' },
              { field: 'cidade', label: 'Cidade', placeholder: 'Salvador' },
              { field: 'bairro', label: 'Bairro', placeholder: 'Cajazeiras' },
              { field: 'horarioFuncionamento', label: 'Horário de funcionamento', placeholder: 'Ex: Seg a Sex: 08h às 18h | Sáb: 08h às 13h' },
            ].map(({ field, label, placeholder }) => (
              <div key={field} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
                <input
                  value={form[field as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={placeholder}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Descrição</label>
              <textarea
                value={form.descricao}
                onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))}
                placeholder="Descreva seu estabelecimento..."
                rows={3}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
              />
            </div>
            {success && (
              <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#16a34a' }}>
                ✓ Perfil atualizado com sucesso!
              </div>
            )}
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', backgroundColor: '#2563EB', color: '#fff', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </form>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 20 }}>Meus serviços</h2>
          <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
            Adicione ou remova os serviços que você oferece. Os tutores poderão filtrar por esses serviços.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, minHeight: 40 }}>
            {servicos.length === 0 ? (
              <p style={{ fontSize: 13, color: '#9ca3af' }}>Nenhum serviço cadastrado ainda.</p>
            ) : servicos.map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 20, padding: '4px 12px' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: '#16a34a' }}>{s}</span>
                <button onClick={() => removerServico(s)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#16a34a', fontSize: 16, lineHeight: 1, padding: 0 }}>
                  ×
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={novoServico}
              onChange={e => setNovoServico(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), adicionarServico())}
              placeholder="Ex: Vacinação, Banho e Tosa..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14 }}
            />
            <button onClick={adicionarServico}
              style={{ padding: '10px 16px', backgroundColor: '#2563EB', color: '#fff', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              + Adicionar
            </button>
          </div>
          <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 8 }}>
            Pressione Enter ou clique em Adicionar. Salve o perfil para confirmar.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
