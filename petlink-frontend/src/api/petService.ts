import api from './axiosInstance'
import type { PetRequestDto, PetResponseDto } from '../types'

export const petService = {
  listar: async (): Promise<PetResponseDto[]> => {
    const response = await api.get<PetResponseDto[]>('/pets')
    return response.data
  },

  buscarPorId: async (id: number): Promise<PetResponseDto> => {
    const response = await api.get<PetResponseDto>(`/pets/${id}`)
    return response.data
  },

  cadastrar: async (data: PetRequestDto): Promise<PetResponseDto> => {
    const response = await api.post<PetResponseDto>('/pets', data)
    return response.data
  },

  remover: async (id: number): Promise<void> => {
    await api.delete(`/pets/${id}`)
  },
}
