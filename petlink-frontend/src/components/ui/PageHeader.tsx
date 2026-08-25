import type { ReactNode } from 'react'
import { colors, fontSize } from '../../theme/tokens'

interface PageHeaderProps {
  title: ReactNode
  subtitle?: string
  actions?: ReactNode
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
      <div>
        <h1 style={{ fontSize: fontSize['2xl'], fontWeight: 640, color: colors.gray[900], lineHeight: 1.2 }}>{title}</h1>
        {subtitle && <p style={{ color: colors.gray[500], fontSize: 14, marginTop: 4 }}>{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{actions}</div>}
    </div>
  )
}
