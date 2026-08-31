import { colors, fontFamily } from '../theme/tokens'

interface BrandLogoProps {
  size?: number
  colorText?: string
}

export function BrandLogo({ size = 28, colorText = colors.brand[800] }: BrandLogoProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <img
        src="/zoop-logo.png"
        alt="Zoop logo"
        width={size * 1.25}
        height={size * 1.25}
        style={{ objectFit: 'contain' }}
      />
      <span style={{ fontFamily: fontFamily.display, fontSize: size * 0.72, fontWeight: 620, letterSpacing: '-0.01em', color: colorText }}>
        Zoop
      </span>
    </div>
  )
}
