import type { CSSProperties, ReactNode } from 'react'
import { colors, radius, fontSize } from '../../theme/tokens'

export type Tone = 'green' | 'gray' | 'yellow' | 'red' | 'dark'

const tones: Record<Tone, CSSProperties> = {
  green: { backgroundColor: colors.brand[100], color: colors.brand[900] },
  gray: { backgroundColor: colors.gray[100], color: colors.gray[600] },
  yellow: { backgroundColor: '#FEF3C7', color: '#92400E' },
  red: { backgroundColor: colors.danger[50], color: colors.danger[600] },
  dark: { backgroundColor: colors.brand[900], color: colors.white },
}

interface BadgeProps {
  children: ReactNode
  tone?: Tone
  style?: CSSProperties
}

export function Badge({ children, tone = 'green', style }: BadgeProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontSize: fontSize.xs,
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: radius.sm,
        whiteSpace: 'nowrap',
        ...tones[tone],
        ...style,
      }}
    >
      {children}
    </span>
  )
}
