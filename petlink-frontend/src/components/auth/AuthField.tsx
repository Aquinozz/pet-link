import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { fieldControl } from '../ui/field'
import { colors } from '../../theme/tokens'

interface AuthFieldProps {
  icon: React.ReactNode
  type?: 'text' | 'email' | 'password'
  placeholder: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
}

export function AuthField({ icon, type = 'text', placeholder, value, onChange, autoComplete }: AuthFieldProps) {
  const [focused, setFocused] = useState(false)
  const [reveal, setReveal] = useState(false)
  const isPassword = type === 'password'

  return (
    <div style={{ position: 'relative', marginBottom: 16 }}>
      <div
        style={{
          position: 'absolute',
          left: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          color: focused ? colors.brand[600] : colors.gray[400],
          display: 'flex',
          pointerEvents: 'none',
        }}
      >
        {icon}
      </div>
      <input
        type={isPassword && reveal ? 'text' : type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...fieldControl(focused),
          paddingLeft: 40,
          paddingRight: isPassword ? 44 : 12,
          height: 46,
        }}
      />
      {isPassword && (
        <button
          type="button"
          aria-label={reveal ? 'Ocultar senha' : 'Mostrar senha'}
          onClick={() => setReveal(r => !r)}
          style={{
            position: 'absolute',
            right: 10,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: colors.gray[400],
          }}
        >
          {reveal ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      )}
    </div>
  )
}
