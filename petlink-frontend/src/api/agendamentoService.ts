import api from './axiosInstance'
import type { AgendamentoRequestDto, AgendamentoResponseDto } from '../types'

export const agendamentoService = {
  listar: async (): Promise<AgendamentoResponseDto[]> => (await api.get('/appointment')).data,
  criar: async (data: AgendamentoRequestDto): Promise<AgendamentoResponseDto> => (await api.post('/appointment', data)).data,
  atualizar: async (id: number, data: AgendamentoRequestDto): Promise<AgendamentoResponseDto> => (await api.put(`/appointment/${id}`, data)).data,
  remover: async (id: number): Promise<void> => { await api.delete(`/appointment/${id}`) },
  atualizarStatus: async (id: number, status: string): Promise<AgendamentoResponseDto> =>
    (await api.patch(`/appointment/${id}/status?status=${status}`)).data,
}
