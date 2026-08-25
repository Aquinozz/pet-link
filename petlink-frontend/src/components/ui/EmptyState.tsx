import type { CSSProperties, ReactNode } from 'react'
import { PawPrint } from 'lucide-react'
import { colors } from '../../theme/tokens'
import { Card } from './Card'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  children?: ReactNode
}

const paw = (style: CSSProperties): CSSProperties => ({ position: 'absolute', color: colors.brand[100], pointerEvents: 'none', ...style })

export function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <Card style={{ textAlign: 'center', padding: '56px 24px', position: 'relative', overflow: 'hidden' }}>
      <PawPrint size={46} style={paw({ top: 16, left: 26, transform: 'rotate(-24deg)' })} />
      <PawPrint size={28} style={paw({ top: 56, left: 68, transform: 'rotate(14deg)', color: colors.brand[50] })} />
      <PawPrint size={40} style={paw({ bottom: -8, right: 22, transform: 'rotate(18deg)' })} />
      {icon && (
        <div
          style={{
            width: 66,
            height: 66,
            margin: '0 auto 16px',
            borderRadius: '50%',
            border: `1.5px dashed ${colors.brand[300]}`,
            padding: 6,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '100%',
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
        </div>
      )}
      <p style={{ fontSize: 16, fontWeight: 600, color: colors.gray[700] }}>{title}</p>
      {description && <p style={{ fontSize: 14, color: colors.gray[400], marginTop: 6 }}>{description}</p>}
      {children && <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center' }}>{children}</div>}
    </Card>
  )
}
