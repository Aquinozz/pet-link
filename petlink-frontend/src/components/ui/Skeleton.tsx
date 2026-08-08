import type { CSSProperties } from 'react'
import { colors, radius } from '../../theme/tokens'

interface SkeletonProps {
  width?: string | number
  height?: number | string
  style?: CSSProperties
}

export function Skeleton({ width = '100%', height = 14, style }: SkeletonProps) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius: radius.sm, backgroundColor: colors.gray[200], ...style }}
    />
  )
}
