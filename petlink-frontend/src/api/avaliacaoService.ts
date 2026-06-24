import api from './axiosInstance'
import type { ReviewRequestDto, ReviewResponseDto } from '../types'

export const avaliacaoService = {
  listar: async (): Promise<ReviewResponseDto[]> => {
    const response = await api.get<ReviewResponseDto[]>('/avaliações')
    return response.data
  },

  criar: async (data: ReviewRequestDto): Promise<ReviewResponseDto> => {
    const response = await api.post<ReviewResponseDto>('/avaliações', data)
    return response.data
  },

  remover: async (id: number): Promise<void> => {
    await api.delete(`/avaliações/${id}`)
  },
}
