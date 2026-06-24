import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { petService } from '../../api/petService'
import { useAuth } from '../../contexts/AuthContext'
import type { PetResponseDto } from '../../types'

const especies = ['Cachorro', 'Gato', 'Coelho', 'Pássaro', 'Peixe', 'Outro']

const emojiEspecie = (e: string) =>
  ({ Cachorro: '🐕', Gato: '🐈', Coelho: '🐇', Pássaro: '🦜' }[e] ?? '🐾')

export default function MeusPets() {
  const { user, tutorId } = useAuth()
  const [pets, setPets] = useState<PetResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nome: '', especie: '', raca: '', idade: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const data = await petService.listar()
      setPets(data.filter(p => p.tutor?.email === user?.email))
    } catch {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      if (!tutorId) { setError('Tutor não identificado. Faça login novamente.'); return }
      await petService.cadastrar({ ...form, idade: Number(form.idade), tutorId })
      setForm({ nome: '', especie: '', raca: '', idade: '' })
      setShowForm(false)
      await load()
    } catch {
      setError('Erro ao cadastrar pet.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>Meus Pets</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>{pets.length} pet(s) cadastrado(s)</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', backgroundColor: '#2563EB', color: '#fff', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          {showForm ? 'Cancelar' : '+ Novo pet'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #e5e7eb', marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 20 }}>Cadastrar novo pet</h2>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { field: 'nome', label: 'Nome do pet', placeholder: 'Rex' },
              { field: 'raca', label: 'Raça', placeholder: 'Labrador' },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
                <input
                  value={form[field as keyof typeof form]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  required placeholder={placeholder}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Espécie</label>
              <select value={form.especie} onChange={e => setForm(f => ({ ...f, especie: e.target.value }))} required
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}>
                <option value="">Selecione</option>
                {especies.map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Idade (anos)</label>
              <input type="number" min="0" max="30" value={form.idade} onChange={e => setForm(f => ({ ...f, idade: e.target.value }))}
                required placeholder="3"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
              />
            </div>
            {error && (
              <div style={{ gridColumn: '1/-1', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#b91c1c' }}>{error}</div>
            )}
            <div style={{ gridColumn: '1/-1' }}>
              <button type="submit" disabled={saving} style={{ padding: '10px 24px', backgroundColor: '#2563EB', color: '#fff', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                {saving ? 'Salvando...' : 'Salvar pet'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#6b7280' }}>Carregando...</p>
      ) : pets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#fff', borderRadius: 16, border: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: 48, marginBottom: 12 }}>🐾</p>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>Nenhum pet cadastrado ainda</p>
          <p style={{ fontSize: 14, color: '#9ca3af' }}>Clique em "Novo pet" para começar</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {pets.map(pet => (
            <div key={pet.id} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{emojiEspecie(pet.especie)}</div>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{pet.nome}</p>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 2 }}>{pet.especie} • {pet.raca}</p>
              <p style={{ fontSize: 13, color: '#6b7280' }}>{pet.idade} ano(s)</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
