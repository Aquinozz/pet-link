export const colors = {
  brand: {
    950: '#0A1F17',
    900: '#123528',
    800: '#1A4636',
    700: '#245A44',
    600: '#2E7055',
    500: '#3E8A69',
    400: '#6BA98A',
    300: '#93C4AB',
    200: '#BCDAC8',
    100: '#DDEDE2',
    50: '#F0F7F2',
  },
  gray: {
    900: '#26221C',
    700: '#443E35',
    600: '#5C554A',
    500: '#756C5F',
    400: '#9A9083',
    300: '#C4BBAE',
    200: '#DED7CB',
    100: '#EEE9DF',
    50: '#F7F4EE',
  },
  accent: '#E0A93E',
  bg: '#FAF7F2',
  border: '#E8E2D6',
  white: '#FFFFFF',
  danger: {
    600: '#CB3A2E',
    500: '#E05243',
    100: '#FBEBE7',
    50: '#FCF3F0',
  },
  success: {
    600: '#2E7055',
    100: '#DDEDE2',
    50: '#F0F7F2',
  },
}

export const fontFamily = {
  display: "'Fraunces Variable', Georgia, 'Times New Roman', serif",
  body: "'Figtree Variable', -apple-system, 'Segoe UI', sans-serif",
}

export const radius = {
  sm: 4,
  md: 6,
  lg: 10,
  xl: 14,
}

export const shadow = {
  sm: '0 1px 2px rgba(38,34,28,0.05)',
  md: '0 1px 2px rgba(38,34,28,0.04), 0 6px 20px rgba(38,34,28,0.07)',
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
  '4xl': 40,
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

export const stateColors = {
  info:    { bg: '#EDF2F7', border: '#C9D8EA', text: '#2B527F', light: '#DEEAF5' },
  success: { bg: '#F0F7F2', border: '#BCDAC8', text: '#245A44', light: '#DDEDE2' },
  warning: { bg: '#FBF3E4', border: '#EBD5AC', text: '#96660F', light: '#F5E7C8' },
  danger:  { bg: '#FBF0EE', border: '#EFD0CA', text: '#B03A2E', light: '#F7E2DD' },
} as const

export const transition = 'all 0.15s ease'

export const breakpoints = { sm: 640, md: 768, lg: 1023 }

export const tokens = { colors, fontFamily, radius, shadow, fontSize, spacing, breakpoints, stateColors, transition }
export default tokens
