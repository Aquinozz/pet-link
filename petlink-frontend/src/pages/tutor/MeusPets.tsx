import { useEffect, useState, useRef } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { API_URL } from '../../api/axiosInstance'
import { petService } from '../../api/petService'
import { useAuth } from '../../contexts/AuthContext'
import type { PetResponseDto } from '../../types'
import { Dog, Cat, Rabbit, Bird, PawPrint, Camera, Trash2 } from 'lucide-react'

const especies = ['Cachorro', 'Gato', 'Coelho', 'Pássaro', 'Peixe', 'Outro']

const especieIcon = (e: string) => {
  const icons: Record<string, React.ReactNode> = {
    Cachorro: <Dog size={48} />,
    Gato: <Cat size={48} />,
    Coelho: <Rabbit size={48} />,
    Pássaro: <Bird size={48} />,
  }
  return icons[e] ?? <PawPrint size={48} />
}

export default function MeusPets() {
  const { user, tutorId } = useAuth()
  const [pets, setPets] = useState<PetResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nome: '', especie: '', raca: '', idade: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingPetId, setUploadingPetId] = useState<number | null>(null)
  const [removendoPetId, setRemovendoPetId] = useState<number | null>(null)
  const fileInputs = useRef<Record<number, HTMLInputElement>>({})

  const load = async () => {
    try {
      const data = await petService.listar()
      setPets(data.filter(p => p.tutor?.email === user?.email))
    } catch {
    } finally {
      setLoading(false)
    }
  }

  const handleFotoUpload = async (petId: number, file: File) => {
    setUploadingPetId(petId)
    try {
      const result = await petService.uploadFoto(petId, file)
      setPets(prev => prev.map(p => p.id === petId ? { ...p, fotoUrl: result.fotoUrl } : p))
    } catch {
    } finally {
      setUploadingPetId(null)
      if (fileInputs.current[petId]) fileInputs.current[petId].value = ''
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

  const handleRemover = async (pet: PetResponseDto) => {
    if (!window.confirm(`Remover o pet "${pet.nome}"?`)) return
    setRemovendoPetId(pet.id)
    try {
      await petService.remover(pet.id)
      setPets(prev => prev.filter(p => p.id !== pet.id))
    } catch {
      alert('Erro ao remover o pet. Tente novamente.')
    } finally {
      setRemovendoPetId(null)
    }
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#111827' }}>Meus Pets</h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>{pets.length} pet(s) cadastrado(s)</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '10px 20px', backgroundColor: '#22C55E', color: '#fff', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          {showForm ? 'Cancelar' : '+ Novo pet'}
        </button>
      </div>

      {showForm && (
        <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, border: '1px solid #F4F7F6', marginBottom: 24 }}>
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
              <button type="submit" disabled={saving} style={{ padding: '10px 24px', backgroundColor: '#22C55E', color: '#fff', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                {saving ? 'Salvando...' : 'Salvar pet'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ color: '#6b7280' }}>Carregando...</p>
      ) : pets.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: '#fff', borderRadius: 16, border: '1px solid #F4F7F6' }}>
          <div style={{ marginBottom: 12 }}><PawPrint size={48} /></div>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>Nenhum pet cadastrado ainda</p>
          <p style={{ fontSize: 14, color: '#9ca3af' }}>Clique em "Novo pet" para começar</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {pets.map(pet => (
            <div key={pet.id} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, border: '1px solid #F4F7F6' }}>
              <div style={{ position: 'relative', width: '100%', height: 120, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {pet.fotoUrl ? (
                  <img src={`${API_URL}${pet.fotoUrl}`} alt={pet.nome}
                    style={{ width: '100%', height: 120, borderRadius: 12, objectFit: 'cover' }}
                  />
                ) : (
                  <div>{especieIcon(pet.especie)}</div>
                )}
                <button onClick={() => fileInputs.current[pet.id]?.click()} disabled={uploadingPetId === pet.id}
                  style={{ position: 'absolute', bottom: 4, right: 4, width: 32, height: 32, borderRadius: '50%', backgroundColor: '#22C55E', color: '#fff', border: 'none', fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {uploadingPetId === pet.id ? '...' : <Camera size={14} />}
                </button>
                <button onClick={() => handleRemover(pet)} disabled={removendoPetId === pet.id}
                  style={{ position: 'absolute', top: 4, right: 4, width: 32, height: 32, borderRadius: '50%', backgroundColor: '#EF4444', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {removendoPetId === pet.id ? '...' : <Trash2 size={14} />}
                </button>
                <input ref={el => { if (el) fileInputs.current[pet.id] = el }} type="file" accept="image/png,image/jpeg,image/jpg"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFotoUpload(pet.id, f) }}
                  style={{ display: 'none' }} />
              </div>
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
