import type { CSSProperties, ReactNode } from 'react'
import { colors, radius, shadow } from '../../theme/tokens'
import { useHover } from './useHover'

export interface CardProps {
  children: ReactNode
  padding?: number | string
  hoverable?: boolean
  style?: CSSProperties
  onClick?: () => void
}

export function Card({ children, padding = 24, hoverable, style, onClick }: CardProps) {
  const { hovered, ...hoverProps } = useHover()
  return (
    <div
      onClick={onClick}
      {...(hoverable ? hoverProps : {})}
      style={{
        backgroundColor: colors.white,
        borderRadius: radius.lg,
        border: `1px solid ${colors.border}`,
        padding,
        transition: hoverable ? 'box-shadow 0.15s ease' : undefined,
        boxShadow: hoverable && hovered ? shadow.md : shadow.sm,
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
