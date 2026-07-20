import api from './axiosInstance'
import type { PrestadorResponseDto } from '../types'

export interface AtualizarPerfilDto {
  telefone?: string
  descricao?: string
  cidade?: string
  bairro?: string
  servicos?: string
}

export const prestadorService = {
  listar: async (): Promise<PrestadorResponseDto[]> => (await api.get('/prestadores')).data,
  buscarPorId: async (id: number): Promise<PrestadorResponseDto> => (await api.get(`/prestadores/${id}`)).data,
  atualizarPerfil: async (data: AtualizarPerfilDto): Promise<PrestadorResponseDto> =>
    (await api.patch('/prestadores/meu-perfil', data)).data,
  listarProximos: async (lat: number, lng: number, raio: number = 50): Promise<PrestadorResponseDto[]> =>
    (await api.get(`/prestadores/proximos?lat=${lat}&lng=${lng}&raio=${raio}`)).data,
}
