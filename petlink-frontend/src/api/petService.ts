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

  uploadFoto: async (petId: number, file: File): Promise<PetResponseDto> => {
    const formData = new FormData()
    formData.append('file', file)
    return (await api.post(`/pets/${petId}/upload-foto`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })).data
  },

  remover: async (id: number): Promise<void> => {
    await api.delete(`/pets/${id}`)
  },
}
