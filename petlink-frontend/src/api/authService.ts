import api from './axiosInstance'
import type { LoginRequestDto, RegisterRequestDto, TokenResponseDto } from '../types'

export interface MeResponse {
  id: number
  nome: string
  email: string
  role: string
  prestadorModelId?: number
  telefone?: string
  servicos?: string
  descricao?: string
  cidade?: string
  bairro?: string
  type?: string
  horarioFuncionamento?: string
}

export const authService = {
  login: async (data: LoginRequestDto): Promise<TokenResponseDto> => {
    const res = await api.post<TokenResponseDto>('/auth/login', data)
    return res.data
  },
  register: async (data: RegisterRequestDto): Promise<void> => {
    await api.post('/auth/register', data)
  },
  me: async (): Promise<MeResponse> => {
    const res = await api.get<MeResponse>('/auth/me')
    return res.data
  },
}
