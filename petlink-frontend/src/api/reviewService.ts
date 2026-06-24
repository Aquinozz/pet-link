import api from './axiosInstance'
import type { ReviewRequestDto, ReviewResponseDto } from '../types'

export const reviewService = {
  listar: async (): Promise<ReviewResponseDto[]> => (await api.get('/reviews')).data,
  criar: async (data: ReviewRequestDto): Promise<ReviewResponseDto> => (await api.post('/reviews', data)).data,
  remover: async (id: number): Promise<void> => { await api.delete(`/reviews/${id}`) },
}
