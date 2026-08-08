import { Star } from 'lucide-react'
import { colors } from '../../theme/tokens'

const starColor = (active: boolean) => (active ? colors.accent : colors.gray[200])

export function StarRating({ value, size = 14 }: { value: number; size?: number }) {
  const rounded = Math.round(value)
  return (
    <div style={{ display: 'inline-flex', gap: 2 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} size={size} fill={starColor(i < rounded)} color={starColor(i < rounded)} />
      ))}
    </div>
  )
}

export function StarRatingInput({
  value,
  onChange,
  size = 20,
}: {
  value: number
  onChange: (n: number) => void
  size?: number
}) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          aria-label={`Nota ${n}`}
          onClick={() => onChange(n)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: size + 12,
            height: size + 12,
            borderRadius: 8,
            border: 'none',
            backgroundColor: 'transparent',
            cursor: 'pointer',
          }}
        >
          <Star size={size} fill={starColor(n <= value)} color={starColor(n <= value)} />
        </button>
      ))}
    </div>
  )
}
