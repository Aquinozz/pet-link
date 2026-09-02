export type UserRole = "ROLE_TUTOR" | "ROLE_PROFISSIONAL" | "ROLE_ADMIN";

export type TipoPrestador =
  | "CLINICA_VETERINARIA"
  | "VETERINARIO"
  | "PETSHOP"
  | "PASSEADOR"
  | "CRECHE_PET"
  | "BANHO_E_TOSA"
  | "PET_SITTER";

export interface LoginRequestDto {
  email: string;
  senha: string;
}

export interface RegisterRequestDto {
  nome: string;
  email: string;
  senha: string;
}

export interface TokenResponseDto {
  token: string;
  expiresIn: number;
}

export interface MeResponse {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
  prestadorModelId?: number;
  telefone?: string;
  servicos?: string;
  descricao?: string;
  cidade?: string;
  bairro?: string;
  type?: TipoPrestador;
  horarioFuncionamento?: string;
  fotoUrl?: string;
}

export interface TutorResponseDto {
  id: number;
  nome: string;
  email: string;
}

export interface PetResponseDto {
  id: number;
  nome: string;
  especie: string;
  raca: string;
  idade: number;
  fotoUrl?: string;
  tutor: TutorResponseDto;
}

export interface PetRequestDto {
  nome: string;
  especie: string;
  raca: string;
  idade: number;
  tutorId: number;
}

export interface PrestadorResponseDto {
  id: number;
  nomePrestador: string;
  email: string;
  telefone?: string;
  avaliacaoMedia?: number;
  servicos?: string;
  descricao?: string;
  cidade?: string;
  bairro?: string;
  type: TipoPrestador;
  horarioFuncionamento?: string;
  latitude?: number;
  longitude?: number;
  distanciaKm?: number;
  fotoUrl?: string;
  bannerUrl?: string;
}

export interface AtualizarPerfilDto {
  telefone?: string;
  descricao?: string;
  cidade?: string;
  bairro?: string;
  servicos?: string;
  horarioFuncionamento?: string;
  latitude?: number;
  longitude?: number;
  fotoUrl?: string;
}

export type AppointmentStatus =
  | "AGENDADO"
  | "CONFIRMADO"
  | "FINALIZADO"
  | "CANCELADO";

export interface AgendamentoRequestDto {
  tutorId: number;
  petId: number;
  prestadorId: number;
  dataHora: string;
  servico?: string;
  atendimentoDomiciliar?: boolean;
  enderecoAtendimento?: string;
}

export interface AgendamentoResponseDto {
  id: number;
  dataHora: string;
  status: AppointmentStatus;
  servico?: string;
  atendimentoDomiciliar?: boolean;
  enderecoAtendimento?: string;
  tutor: TutorResponseDto;
  pet: PetResponseDto;
  prestador: PrestadorResponseDto;
}

export interface ReviewRequestDto {
  tutorId: number;
  prestadorId: number;
  agendamentoId: number;
  nota: number;
  comentario?: string;
}

export interface ReviewResponseDto {
  id: number;
  nota: number;
  comentario?: string;
  dataCriacao: string;
  agendamentoId?: number;
  tutorId: number;
  tutorNome: string;
  prestadorId: number;
  prestadorNome: string;
  prestadorCidade?: string;
  prestadorBairro?: string;
}