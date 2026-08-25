import { colors, fontFamily } from '../theme/tokens'

interface BrandLogoProps {
  size?: number
  colorText?: string
}

export function BrandLogo({ size = 28, colorText = colors.brand[800] }: BrandLogoProps) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="PetLink logo"
      >
        <path
          d="M32 6C20 6 10 16 10 28c0 13 10 22 22 30 12-8 22-17 22-30C54 16 44 6 32 6Z"
          fill="#1A4636"
        />
        <path
          d="M40 24c0 5-4 9-8 9s-8-4-8-9 4-9 8-9 8 4 8 9Z"
          fill="#E0A93E"
        />
        <path d="M26 24c0 2 1 4 2 4s2-2 2-4-1-4-2-4-2 2-2 4Z" fill="#FAF7F2" />
      </svg>
      <span style={{ fontFamily: fontFamily.display, fontSize: size * 0.72, fontWeight: 620, letterSpacing: '-0.01em', color: colorText }}>
        Pet<span style={{ color: colors.brand[600] }}>Link</span>
      </span>
    </div>
  )
}
