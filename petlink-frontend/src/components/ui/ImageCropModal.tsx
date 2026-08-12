import { useCallback, useEffect, useRef, useState } from 'react'
import Cropper from 'react-easy-crop'
import type { Area, Point } from 'react-easy-crop'
import { getCroppedImg } from '../../utils/cropImage'
import { Button } from './Button'
import { colors, radius, shadow } from '../../theme/tokens'

function CropPreview({ imageSrc, crop }: { imageSrc: string; crop: Area }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !crop) return
    const image = new Image()
    image.onload = () => {
      canvas.width = crop.width
      canvas.height = crop.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height)
    }
    image.src = imageSrc
  }, [imageSrc, crop])

  return (
    <canvas ref={canvasRef}
      style={{ width: 72, height: 72, borderRadius: radius.xl, objectFit: 'cover', border: `1px solid ${colors.border}` }} />
  )
}

export default function ImageCropModal({
  imageSrc,
  onCancel,
  onConfirm,
}: {
  imageSrc: string
  onCancel: () => void
  onConfirm: (blob: Blob) => void
}) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return
    setProcessing(true)
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels)
      onConfirm(blob)
    } catch {
      onCancel()
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div onClick={onCancel}
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: 20 }}>
      <div onClick={e => e.stopPropagation()}
        style={{ backgroundColor: colors.white, borderRadius: radius.xl, boxShadow: shadow.md, width: '100%', maxWidth: 480, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: colors.gray[900], margin: 0 }}>Ajustar foto</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 12, color: colors.gray[400] }}>Prévia</span>
            {croppedAreaPixels && <CropPreview imageSrc={imageSrc} crop={croppedAreaPixels} />}
          </div>
        </div>

        <div style={{ position: 'relative', width: '100%', height: 320, backgroundColor: '#000', borderRadius: radius.lg, overflow: 'hidden' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid={false}
          />
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 12, color: colors.gray[500] }}>−</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              style={{ flex: 1, accentColor: colors.brand[600] }}
              aria-label="Zoom da imagem"
            />
            <span style={{ fontSize: 12, color: colors.gray[500] }}>+</span>
          </div>
          <p style={{ fontSize: 12, color: colors.gray[400], margin: '8px 0 0' }}>
            Arraste a imagem para posicionar e use o controle para dar zoom.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          <Button variant="secondary" style={{ flex: 1 }} onClick={onCancel} disabled={processing}>
            Cancelar
          </Button>
          <Button variant="primary" style={{ flex: 1 }} onClick={handleConfirm} loading={processing}>
            {processing ? 'Processando...' : 'Confirmar'}
          </Button>
        </div>
      </div>
    </div>
  )
}