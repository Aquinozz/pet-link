import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { colors, radius } from '../../theme/tokens'
import { useHover } from './useHover'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children?: ReactNode
}

const padding: Record<Size, CSSProperties> = {
  sm: { padding: '6px 12px' },
  md: { padding: '9px 16px' },
  lg: { padding: '12px 20px' },
}

const baseFont: Record<Size, number> = { sm: 13, md: 14, lg: 15 }

const variantColor = (variant: Variant, hovered: boolean, disabled: boolean) => {
  if (variant === 'primary') return { backgroundColor: disabled ? colors.brand[400] : hovered ? colors.brand[700] : colors.brand[600], color: colors.white }
  if (variant === 'danger') return { backgroundColor: disabled ? colors.danger[100] : hovered ? '#B91C1C' : colors.danger[600], color: colors.white }
  if (variant === 'secondary') return { backgroundColor: hovered ? colors.gray[100] : colors.white, color: colors.gray[700], border: `1px solid ${hovered ? colors.gray[300] : colors.gray[200]}` }
  return { backgroundColor: hovered ? colors.gray[100] : 'transparent', color: colors.gray[700] }
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  children,
  style,
  type = 'button',
  onMouseEnter,
  onMouseLeave,
  ...rest
}: ButtonProps) {
  const { hovered, ...hoverProps } = useHover()
  const isDisabled = !!disabled || !!loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      onMouseEnter={(e) => { onMouseEnter?.(e); hoverProps.onMouseEnter() }}
      onMouseLeave={(e) => { onMouseLeave?.(e); hoverProps.onMouseLeave() }}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        fontFamily: 'inherit',
        fontWeight: 600,
        fontSize: baseFont[size],
        borderRadius: radius.md,
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.15s ease, border-color 0.15s ease',
        opacity: isDisabled ? 0.6 : 1,
        ...padding[size],
        ...variantColor(variant, hovered, isDisabled),
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}
