import { useEffect, useState, useRef } from 'react'
import { Camera, PawPrint } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { API_URL } from '../../api/axiosInstance'
import { petService } from '../../api/petService'
import { useAuth } from '../../contexts/AuthContext'
import type { PetResponseDto } from '../../types'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Input'
import { EmptyState } from '../../components/ui/EmptyState'
import { EspecieIcon } from '../../components/ui/EspecieIcon'
import { Skeleton } from '../../components/ui/Skeleton'
import { colors, radius, fontSize } from '../../theme/tokens'

const especies = ['Cachorro', 'Gato', 'Coelho', 'Pássaro', 'Peixe', 'Outro']

export default function MeusPets() {
  const { user, tutorId } = useAuth()
  const [pets, setPets] = useState<PetResponseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ nome: '', especie: '', raca: '', idade: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploadingPetId, setUploadingPetId] = useState<number | null>(null)
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

  return (
    <DashboardLayout>
      <PageHeader
        title="Meus Pets"
        subtitle={`${pets.length} pet(s) cadastrado(s)`}
        actions={
          <Button variant={showForm ? 'secondary' : 'primary'} onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : '+ Novo pet'}
          </Button>
        }
      />

      {showForm && (
        <Card padding={24} style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.gray[900], marginBottom: 20 }}>Cadastrar novo pet</h2>
          <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
            <Input label="Nome do pet" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} required placeholder="Rex" />
            <Input label="Raça" value={form.raca} onChange={e => setForm(f => ({ ...f, raca: e.target.value }))} placeholder="Labrador" />
            <Select label="Espécie" value={form.especie} onChange={e => setForm(f => ({ ...f, especie: e.target.value }))} required>
              <option value="">Selecione</option>
              {especies.map(e => <option key={e}>{e}</option>)}
            </Select>
            <Input label="Idade (anos)" type="number" min="0" max="30" value={form.idade} onChange={e => setForm(f => ({ ...f, idade: e.target.value }))} required placeholder="3" />
            {error && (
              <div style={{ gridColumn: '1/-1', backgroundColor: colors.danger[50], border: `1px solid ${colors.danger[100]}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: colors.danger[600] }}>{error}</div>
            )}
            <div style={{ gridColumn: '1/-1' }}>
              <Button type="submit" loading={saving}>{saving ? 'Salvando...' : 'Salvar pet'}</Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} padding={20}>
              <Skeleton height={120} style={{ borderRadius: radius.lg, marginBottom: 12 }} />
              <Skeleton width="60%" height={16} style={{ marginBottom: 8 }} />
              <Skeleton width="40%" height={13} />
            </Card>
          ))}
        </div>
      ) : pets.length === 0 ? (
        <EmptyState
          icon={<PawPrint size={28} />}
          title="Nenhum pet cadastrado ainda"
          description="Clique em 'Novo pet' para cadastrar seu primeiro pet."
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {pets.map(pet => (
            <Card key={pet.id} padding={20}>
              <div style={{ position: 'relative', width: '100%', height: 120, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg, borderRadius: radius.lg }}>
                {pet.fotoUrl ? (
                  <img src={`${API_URL}${pet.fotoUrl}`} alt={pet.nome}
                    style={{ width: '100%', height: 120, borderRadius: radius.lg, objectFit: 'cover' }}
                  />
                ) : (
                  <EspecieIcon especie={pet.especie} />
                )}
                <button
                  onClick={() => fileInputs.current[pet.id]?.click()}
                  disabled={uploadingPetId === pet.id}
                  aria-label="Alterar foto"
                  style={{
                    position: 'absolute',
                    bottom: 6,
                    right: 6,
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    backgroundColor: colors.brand[600],
                    color: colors.white,
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {uploadingPetId === pet.id ? '…' : <Camera size={14} />}
                </button>
                <input
                  ref={el => { if (el) fileInputs.current[pet.id] = el }}
                  type="file" accept="image/png,image/jpeg,image/jpg"
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleFotoUpload(pet.id, f) }}
                  style={{ display: 'none' }}
                />
              </div>
              <p style={{ fontSize: 17, fontWeight: 700, color: colors.gray[900], marginBottom: 4 }}>{pet.nome}</p>
              <p style={{ fontSize: 13, color: colors.gray[500], marginBottom: 2 }}>{pet.especie} • {pet.raca}</p>
              <p style={{ fontSize: fontSize.sm, color: colors.gray[500] }}>{pet.idade} ano(s)</p>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
