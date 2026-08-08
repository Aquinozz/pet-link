import { colors } from '../../theme/tokens'

const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  return parts.map(p => p[0]).join('').toUpperCase()
}

interface AvatarProps {
  name?: string
  src?: string
  size?: number
}

export function Avatar({ name, src, size = 32 }: AvatarProps) {
  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    objectFit: 'cover' as const,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.4,
    fontWeight: 700,
    color: colors.white,
    backgroundColor: colors.brand[800],
  }
  if (src) return <img src={src} alt={name ?? ''} style={style} />
  return <div style={style} aria-hidden>{name ? initials(name) : '?'}</div>
}
