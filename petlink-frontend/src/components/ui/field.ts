import type { CSSProperties } from 'react'
import { colors, radius } from '../../theme/tokens'

export function fieldControl(focused: boolean): CSSProperties {
  return {
    width: '100%',
    padding: '10px 12px',
    borderRadius: radius.md,
    border: `1px solid ${focused ? colors.brand[600] : colors.gray[300]}`,
    fontSize: 14,
    color: colors.gray[900],
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s ease',
    backgroundColor: colors.white,
  }
}

export function fieldLabel(): CSSProperties {
  return {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: colors.gray[700],
    marginBottom: 6,
  }
}
