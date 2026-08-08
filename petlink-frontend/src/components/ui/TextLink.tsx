import { Link } from 'react-router-dom'
import { colors } from '../../theme/tokens'
import { useHover } from './useHover'

export function TextLink({ to, children }: { to: string; children: React.ReactNode }) {
  const { hovered, ...hoverProps } = useHover()
  return (
    <Link
      to={to}
      {...hoverProps}
      style={{ fontSize: 13, fontWeight: 600, color: hovered ? colors.brand[600] : colors.gray[500], textDecoration: 'none' }}
    >
      {children}
    </Link>
  )
}
