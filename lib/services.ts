import { api } from "./api";
import type {
  AgendamentoRequestDto,
  AgendamentoResponseDto,
  AtualizarPerfilDto,
  LoginRequestDto,
  MeResponse,
  PetRequestDto,
  PetResponseDto,
  PrestadorResponseDto,
  RegisterRequestDto,
  ReviewRequestDto,
  ReviewResponseDto,
  TokenResponseDto,
} from "./types";

export const authService = {
  login: (data: LoginRequestDto) =>
    api.post<TokenResponseDto>("/auth/login", data).then((r) => r.data),
  register: (data: RegisterRequestDto) =>
    api.post("/auth/register", data).then((r) => r.data),
  me: () => api.get<MeResponse>("/auth/me").then((r) => r.data),
};

export const petService = {
  listar: () => api.get<PetResponseDto[]>("/pets").then((r) => r.data),
  buscarPorId: (id: number) =>
    api.get<PetResponseDto>(`/pets/${id}`).then((r) => r.data),
  cadastrar: (data: PetRequestDto) =>
    api.post<PetResponseDto>("/pets", data).then((r) => r.data),
  uploadFoto: (petId: number, file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api
      .post<PetResponseDto>(`/pets/${petId}/upload-foto`, form)
      .then((r) => r.data);
  },
  remover: (id: number) => api.delete(`/pets/${id}`).then((r) => r.data),
};

export const prestadorService = {
  listar: () =>
    api.get<PrestadorResponseDto[]>("/prestadores").then((r) => r.data),
  buscarPorId: (id: number) =>
    api.get<PrestadorResponseDto>(`/prestadores/${id}`).then((r) => r.data),
  atualizarPerfil: (data: AtualizarPerfilDto) =>
    api
      .patch<PrestadorResponseDto>("/prestadores/meu-perfil", data)
      .then((r) => r.data),
  listarProximos: (lat: number, lng: number, raio = 50) =>
    api
      .get<PrestadorResponseDto[]>(
        `/prestadores/proximos?lat=${lat}&lng=${lng}&raio=${raio}`
      )
      .then((r) => r.data),
  listarTopAvaliados: (limit = 10) =>
    api
      .get<PrestadorResponseDto[]>(`/prestadores/top-avaliados?limit=${limit}`)
      .then((r) => r.data),
};

export const agendamentoService = {
  listar: () =>
    api.get<AgendamentoResponseDto[]>("/appointment").then((r) => r.data),
  criar: (data: AgendamentoRequestDto) =>
    api.post<AgendamentoResponseDto>("/appointment", data).then((r) => r.data),
  atualizar: (id: number, data: AgendamentoRequestDto) =>
    api
      .put<AgendamentoResponseDto>(`/appointment/${id}`, data)
      .then((r) => r.data),
  remover: (id: number) => api.delete(`/appointment/${id}`).then((r) => r.data),
  atualizarStatus: (id: number, status: string) =>
    api
      .patch<AgendamentoResponseDto>(
        `/appointment/${id}/status?status=${status}`
      )
      .then((r) => r.data),
};

export const reviewService = {
  listar: () => api.get<ReviewResponseDto[]>("/reviews").then((r) => r.data),
  criar: (data: ReviewRequestDto) =>
    api.post<ReviewResponseDto>("/reviews", data).then((r) => r.data),
  remover: (id: number) => api.delete(`/reviews/${id}`).then((r) => r.data),
};