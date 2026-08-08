import { Dog, Cat, Rabbit, Bird, PawPrint } from 'lucide-react'
import { colors } from '../../theme/tokens'

const icons = {
  Cachorro: Dog,
  Gato: Cat,
  Coelho: Rabbit,
  'Pássaro': Bird,
}

export function EspecieIcon({ especie, size = 48 }: { especie?: string; size?: number }) {
  const Icon = especie ? icons[especie as keyof typeof icons] : undefined
  return Icon ? <Icon size={size} /> : <PawPrint size={size} color={colors.brand[600]} />
}
