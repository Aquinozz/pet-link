import type { ReactNode } from 'react'
import { colors } from '../../theme/tokens'

interface SectionHeaderProps {
  title: string
  action?: ReactNode
}

export function SectionHeader({ title, action }: SectionHeaderProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.gray[900] }}>{title}</h2>
      {action}
    </div>
  )
}
