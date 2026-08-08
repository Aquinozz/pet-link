import type { ReactNode } from 'react'
import { colors } from '../../theme/tokens'
import { Card } from './Card'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  children?: ReactNode
}

export function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <Card style={{ textAlign: 'center', padding: '56px 24px' }}>
      {icon && (
        <div
          style={{
            width: 56,
            height: 56,
            margin: '0 auto 16px',
            borderRadius: '50%',
            backgroundColor: colors.brand[50],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.brand[600],
          }}
        >
          {icon}
        </div>
      )}
      <p style={{ fontSize: 16, fontWeight: 600, color: colors.gray[700] }}>{title}</p>
      {description && <p style={{ fontSize: 14, color: colors.gray[400], marginTop: 6 }}>{description}</p>}
      {children && <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>{children}</div>}
    </Card>
  )
}
