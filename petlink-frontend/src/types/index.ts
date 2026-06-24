export interface LoginRequestDto {
  email: string
  senha: string
}

export interface RegisterRequestDto {
  nome: string
  email: string
  senha: string
}

export interface TokenResponseDto {
  token: string
  expiresIn: number
}

export interface TutorResponseDto {
  id: number
  nome: string
  email: string
}

export interface PetRequestDto {
  nome: string
  especie: string
  raca: string
  idade: number
  tutorId: number
}

export interface PetResponseDto {
  id: number
  nome: string
  especie: string
  raca: string
  idade: number
  tutor: TutorResponseDto
}

export type TipoPrestador =
  | 'CLINICA_VETERINARIA'
  | 'VETERINARIO'
  | 'PETSHOP'
  | 'PASSEADOR'
  | 'CRECHE_PET'
  | 'BANHO_E_TOSA'
  | 'PET_SITTER'

export interface PrestadorResponseDto {
  id: number
  nomePrestador: string
  email: string
  telefone: string
  avaliacaoMedia: number
  servicos: string
  descricao: string
  cidade: string
  bairro: string
  type: string
  horarioFuncionamento?: string
}

export interface AgendamentoRequestDto {
  tutorId: number
  petId: number
  prestadorId: number
  dataHora: string
  servico?: string
}

export interface AgendamentoResponseDto {
  id: number
  dataHora: string
  status: 'AGENDADO' | 'CONFIRMADO' | 'FINALIZADO' | 'CANCELADO'
  servico?: string
  tutor: TutorResponseDto
  pet: PetResponseDto
  prestador: PrestadorResponseDto
}

export interface ReviewRequestDto {
  tutorId: number
  prestadorId: number
  nota: number
  comentario: string
}

export interface ReviewResponseDto {
  id: number
  nota: number
  comentario: string
  dataCriacao: string
  tutorId: number
  tutorNome: string
  prestadorId: number
  prestadorNome: string
  prestadorCidade: string
  prestadorBairro: string
}

export type UserRole = 'ROLE_TUTOR' | 'ROLE_PROFISSIONAL' | 'ROLE_ADMIN'

export interface AuthUser {
  email: string
  role: UserRole
}
