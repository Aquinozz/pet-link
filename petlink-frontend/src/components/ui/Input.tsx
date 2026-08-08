import { useState, type InputHTMLAttributes, type TextareaHTMLAttributes, type ReactNode } from 'react'
import { colors } from '../../theme/tokens'
import { fieldControl, fieldLabel } from './field'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  noMargin?: boolean
}

export function Input({ label, error, hint, noMargin, style, onFocus, onBlur, ...rest }: InputProps) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: noMargin ? 0 : 16 }}>
      {label && <label style={fieldLabel()}>{label}</label>}
      <input
        {...rest}
        onFocus={(e) => { setFocused(true); onFocus?.(e) }}
        onBlur={(e) => { setFocused(false); onBlur?.(e) }}
        style={{ ...fieldControl(focused), ...style }}
      />
      {hint && !error && <p style={{ fontSize: 12, color: colors.gray[400], marginTop: 6 }}>{hint}</p>}
      {error && <p style={{ fontSize: 12, color: colors.danger[600], marginTop: 6 }}>{error}</p>}
    </div>
  )
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  noMargin?: boolean
}

export function Textarea({ label, error, noMargin, style, onFocus, onBlur, ...rest }: TextareaProps) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: noMargin ? 0 : 16 }}>
      {label && <label style={fieldLabel()}>{label}</label>}
      <textarea
        {...rest}
        onFocus={(e) => { setFocused(true); onFocus?.(e) }}
        onBlur={(e) => { setFocused(false); onBlur?.(e) }}
        style={{ ...fieldControl(focused), resize: 'vertical', ...style }}
      />
      {error && <p style={{ fontSize: 12, color: colors.danger[600], marginTop: 6 }}>{error}</p>}
    </div>
  )
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  children: ReactNode
  noMargin?: boolean
}

export function Select({ label, children, noMargin, style, onFocus, onBlur, ...rest }: SelectProps) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ marginBottom: noMargin ? 0 : 16 }}>
      {label && <label style={fieldLabel()}>{label}</label>}
      <select
        {...rest}
        onFocus={(e) => { setFocused(true); onFocus?.(e) }}
        onBlur={(e) => { setFocused(false); onBlur?.(e) }}
        style={{ ...fieldControl(focused), ...style }}
      >
        {children}
      </select>
    </div>
  )
}
