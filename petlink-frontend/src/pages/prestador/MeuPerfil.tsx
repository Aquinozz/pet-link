import { useEffect, useState, useRef } from 'react'
import { Building, Camera, Check, Plus, X, Image, Trash2 } from 'lucide-react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { API_URL } from '../../api/axiosInstance'
import { authService } from '../../api/authService'
import { prestadorService } from '../../api/prestadorService'
import { useAuth } from '../../contexts/useAuth'
import type { MeResponse } from '../../api/authService'
import { PageHeader } from '../../components/ui/PageHeader'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input, Textarea } from '../../components/ui/Input'
import { Skeleton } from '../../components/ui/Skeleton'
import ImageCropModal from '../../components/ui/ImageCropModal'
import { colors, radius } from '../../theme/tokens'

export default function MeuPerfil() {
  const { setFotoUrl } = useAuth()
  const [perfil, setPerfil] = useState<MeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [novoServico, setNovoServico] = useState('')
  const [fotoUploading, setFotoUploading] = useState(false)
  const [fotoSuccess, setFotoSuccess] = useState(false)
  const [bannerUploading, setBannerUploading] = useState(false)
  const [bannerSuccess, setBannerSuccess] = useState(false)
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [cropBanner, setCropBanner] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const bannerInputRef = useRef<HTMLInputElement>(null)
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

  const handleSelectFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCropImage(URL.createObjectURL(file))
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleUploadFoto = async (blob: Blob) => {
    setFotoUploading(true)
    setFotoSuccess(false)
    try {
      const result = await prestadorService.uploadFoto(new File([blob], 'foto.jpg', { type: 'image/jpeg' }))
      setPerfil(prev => prev ? { ...prev, fotoUrl: result.fotoUrl } : null)
      setFotoUrl(result.fotoUrl ?? null)
      setFotoSuccess(true)
      setTimeout(() => setFotoSuccess(false), 3000)
    } catch {
    } finally {
      setFotoUploading(false)
      setCropImage(null)
    }
  }

  const handleUploadBanner = async (blob: Blob) => {
    setBannerUploading(true)
    setBannerSuccess(false)
    try {
      const result = await prestadorService.uploadBanner(new File([blob], 'banner.jpg', { type: 'image/jpeg' }))
      setPerfil(prev => prev ? { ...prev, bannerUrl: result.bannerUrl } : null)
      setBannerSuccess(true)
      setTimeout(() => setBannerSuccess(false), 3000)
    } catch {
    } finally {
      setBannerUploading(false)
      setCropBanner(null)
    }
  }

  const handleRemoveBanner = async () => {
    setBannerUploading(true)
    try {
await prestadorService.removerBanner()
        setPerfil(prev => prev ? { ...prev, bannerUrl: undefined } : null)
    } catch {
    } finally {
      setBannerUploading(false)
    }
  }

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

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 24 }}>
          <Skeleton width={96} height={96} style={{ borderRadius: radius.lg }} />
          <div style={{ flex: 1 }}>
            <Skeleton width={200} height={18} style={{ marginBottom: 10 }} />
            <Skeleton width={140} height={13} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <Card padding={24}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={40} />)}
            </div>
          </Card>
          <Card padding={24}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} height={40} />)}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Meu Perfil"
        subtitle="Gerencie suas informações e serviços oferecidos"
        actions={perfil ? <span style={{ fontSize: 13, color: colors.gray[400] }}>{perfil.nome} • {perfil.email}</span> : undefined}
      />

      <Card padding={24} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative' }}>
          {perfil?.fotoUrl ? (
            <img src={`${API_URL}${perfil.fotoUrl}`} alt="Foto do perfil"
              style={{ width: 96, height: 96, borderRadius: radius.lg, objectFit: 'cover', border: `1px solid ${colors.border}` }}
            />
          ) : (
            <div style={{ width: 96, height: 96, borderRadius: radius.lg, backgroundColor: colors.brand[100], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={40} color={colors.brand[600]} />
            </div>
          )}
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.gray[900], margin: '0 0 4px' }}>Foto de perfil</h3>
          <p style={{ fontSize: 12, color: colors.gray[400], marginBottom: 12 }}>PNG, JPG ou JPEG. Máx 10MB.</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button variant={fotoUploading ? 'secondary' : 'primary'} size="sm" onClick={() => fileInputRef.current?.click()} disabled={fotoUploading}>
              {fotoUploading ? 'Enviando...' : <><Camera size={14} /> Escolher foto</>}
            </Button>
            {fotoSuccess && <span style={{ fontSize: 13, color: colors.success[600], fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Check size={14} /> Foto salva</span>}
          </div>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/jpg" onChange={handleSelectFoto} style={{ display: 'none' }} />
        </div>
      </Card>

      <Card padding={24} style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', minWidth: 240, maxWidth: 400 }}>
          {perfil?.bannerUrl ? (
            <img src={`${API_URL}${perfil.bannerUrl}`} alt="Banner do perfil"
              style={{ width: '100%', aspectRatio: '16 / 5', borderRadius: radius.lg, objectFit: 'cover', border: `1px solid ${colors.border}` }}
            />
          ) : (
            <div style={{ width: '100%', aspectRatio: '16 / 5', borderRadius: radius.lg, background: `linear-gradient(135deg, ${colors.brand[200]} 0%, ${colors.brand[100]} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `2px dashed ${colors.brand[400]}` }}>
              <span style={{ fontSize: 13, color: colors.gray[400] }}>Nenhum banner enviado</span>
            </div>
          )}
        </div>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: colors.gray[900], margin: '0 0 4px' }}>Banner do perfil</h3>
          <p style={{ fontSize: 12, color: colors.gray[400], marginBottom: 12 }}>PNG, JPG ou JPEG. Máx 10MB. Proporção 16:5 recomendada.</p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button variant={bannerUploading ? 'secondary' : 'primary'} size="sm" onClick={() => bannerInputRef.current?.click()} disabled={bannerUploading || !!cropBanner}>
              {bannerUploading ? 'Enviando...' : <><Image size={14} /> Escolher banner</>}
            </Button>
            {bannerSuccess && <span style={{ fontSize: 13, color: colors.success[600], fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}><Check size={14} /> Banner salvo</span>}
            {perfil?.bannerUrl && !bannerUploading && (
              <Button variant="secondary" size="sm" onClick={handleRemoveBanner}><Trash2 size={14} /> Remover</Button>
            )}
          </div>
          <input ref={bannerInputRef} type="file" accept="image/png,image/jpeg,image/jpg" onChange={e => { const f = e.target.files?.[0]; if (f) setCropBanner(URL.createObjectURL(f)); if (bannerInputRef.current) bannerInputRef.current.value = '' }} style={{ display: 'none' }} />
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        <Card padding={24}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.gray[900], marginBottom: 20 }}>Informações do perfil</h2>
          <form onSubmit={handleSave}>
            <Input label="Telefone" value={form.telefone} onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))} placeholder="71 99999-9999" />
            <Input label="Cidade" value={form.cidade} onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))} placeholder="Salvador" />
            <Input label="Bairro" value={form.bairro} onChange={e => setForm(f => ({ ...f, bairro: e.target.value }))} placeholder="Cajazeiras" />
            <Input label="Horário de funcionamento" value={form.horarioFuncionamento} onChange={e => setForm(f => ({ ...f, horarioFuncionamento: e.target.value }))} placeholder="Ex: Seg a Sex: 08h às 18h | Sáb: 08h às 13h" />
            <Textarea label="Descrição" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Descreva seu estabelecimento..." rows={3} />
            {success && (
              <div style={{ backgroundColor: colors.success[50], border: `1px solid ${colors.success[100]}`, borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: colors.success[600], display: 'flex', alignItems: 'center', gap: 6 }}>
                <Check size={14} /> Perfil atualizado com sucesso!
              </div>
            )}
            <Button type="submit" loading={saving}>{saving ? 'Salvando...' : 'Salvar alterações'}</Button>
          </form>
        </Card>

        <Card padding={24}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.gray[900], marginBottom: 20 }}>Meus serviços</h2>
          <p style={{ fontSize: 13, color: colors.gray[500], marginBottom: 16 }}>
            Adicione ou remova os serviços que você oferece. Os tutores poderão filtrar por esses serviços.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20, minHeight: 40 }}>
            {servicos.length === 0 ? (
              <p style={{ fontSize: 13, color: colors.gray[400] }}>Nenhum serviço cadastrado ainda.</p>
            ) : servicos.map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, backgroundColor: colors.brand[50], border: `1px solid ${colors.border}`, borderRadius: 20, padding: '4px 12px' }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: colors.brand[800] }}>{s}</span>
                <button onClick={() => removerServico(s)} aria-label={`Remover ${s}`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.gray[400], display: 'flex', padding: 2 }}>
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <Input value={novoServico} onChange={e => setNovoServico(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), adicionarServico())}
              placeholder="Ex: Vacinação, Banho e Tosa..." style={{ flex: 1, marginBottom: 0 }} />
            <Button variant="secondary" onClick={adicionarServico}><Plus size={15} /> Adicionar</Button>
          </div>
          <p style={{ fontSize: 11, color: colors.gray[400], marginTop: 8 }}>
            Pressione Enter ou clique em Adicionar. Salve o perfil para confirmar.
          </p>
        </Card>
      </div>

      {cropImage && (
        <ImageCropModal
          imageSrc={cropImage}
          onCancel={() => setCropImage(null)}
          onConfirm={handleUploadFoto}
        />
      )}
      {cropBanner && (
        <ImageCropModal
          imageSrc={cropBanner}
          onCancel={() => setCropBanner(null)}
          onConfirm={handleUploadBanner}
          aspectRatio={4}
        />
      )}
    </DashboardLayout>
  )
}
