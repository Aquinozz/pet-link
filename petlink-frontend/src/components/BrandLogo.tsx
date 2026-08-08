interface BrandLogoProps {
  size?: number
  colorText?: string
}

export function BrandLogo({ size = 28, colorText = '#0D3B34' }: BrandLogoProps) {
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
          fill="#0D3B34"
        />
        <path
          d="M40 24c0 5-4 9-8 9s-8-4-8-9 4-9 8-9 8 4 8 9Z"
          fill="#16A34A"
        />
        <path d="M26 24c0 2 1 4 2 4s2-2 2-4-1-4-2-4-2 2-2 4Z" fill="#F4F7F6" />
      </svg>
      <span style={{ fontSize: size * 0.7, fontWeight: 800, color: colorText }}>
        Pet<span style={{ color: '#16A34A' }}>Link</span>
      </span>
    </div>
  )
}
