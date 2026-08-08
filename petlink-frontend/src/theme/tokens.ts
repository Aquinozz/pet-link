export const colors = {
  brand: {
    950: '#0A2E28',
    900: '#0D3B34',
    800: '#0F4A40',
    700: '#15803D',
    600: '#16A34A',
    500: '#22C55E',
    400: '#4ADE80',
    200: '#A7E07E',
    100: '#EAF8ED',
    50: '#F0FDF4',
  },
  gray: {
    900: '#111827',
    700: '#374151',
    600: '#4B5563',
    500: '#6B7280',
    400: '#9CA3AF',
    300: '#D1D5DB',
    200: '#E5E7EB',
    100: '#F3F4F6',
    50: '#F9FAFB',
  },
  accent: '#FACC15',
  bg: '#F4F7F6',
  border: '#E5E7EB',
  white: '#FFFFFF',
  danger: {
    600: '#DC2626',
    500: '#EF4444',
    100: '#FEE2E2',
    50: '#FEF2F2',
  },
  success: {
    600: '#16A34A',
    100: '#DCFCE7',
    50: '#F0FDF4',
  },
}

export const radius = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
}

export const shadow = {
  sm: '0 1px 2px rgba(15,23,42,0.04)',
  md: '0 1px 3px rgba(15,23,42,0.05), 0 4px 16px rgba(15,23,42,0.04)',
}

export const fontSize = {
  xs: 12,
  sm: 13,
  base: 14,
  md: 15,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
}

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
}

export const tokens = { colors, radius, shadow, fontSize, spacing }
export default tokens
