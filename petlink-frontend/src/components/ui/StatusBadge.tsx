import { Badge } from './Badge'
import type { Tone } from './Badge'

type Status = 'AGENDADO' | 'CONFIRMADO' | 'FINALIZADO' | 'CANCELADO'

const statusMap: Record<Status, { label: string; tone: Tone }> = {
  AGENDADO: { label: 'Agendado', tone: 'yellow' },
  CONFIRMADO: { label: 'Confirmado', tone: 'green' },
  FINALIZADO: { label: 'Finalizado', tone: 'gray' },
  CANCELADO: { label: 'Cancelado', tone: 'red' },
}

export function StatusBadge({ status }: { status: string }) {
  const mapped = statusMap[status as Status]
  if (!mapped) return <Badge tone="gray">{status}</Badge>
  return <Badge tone={mapped.tone}>{mapped.label}</Badge>
}
