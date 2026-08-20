import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('./axiosInstance', () => ({
  __esModule: true,
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

import api from './axiosInstance'
import { authService } from './authService'

const mockPost = vi.mocked(api.post)
const mockGet = vi.mocked(api.get)

beforeEach(() => vi.clearAllMocks())

describe('authService', () => {
  it('login chama POST /auth/login com as credenciais', async () => {
    mockPost.mockResolvedValueOnce({ data: { token: 'jwt-token', expiresIn: 900000 } })

    const result = await authService.login({ email: 'a@b.com', senha: '123456' })

    expect(mockPost).toHaveBeenCalledWith('/auth/login', { email: 'a@b.com', senha: '123456' })
    expect(result.token).toBe('jwt-token')
  })

  it('register chama POST /auth/register', async () => {
    mockPost.mockResolvedValueOnce({ data: {} })

    await authService.register({ nome: 'Ana', email: 'a@b.com', senha: '123456' })

    expect(mockPost).toHaveBeenCalledWith('/auth/register', { nome: 'Ana', email: 'a@b.com', senha: '123456' })
  })

  it('me chama GET /auth/me e retorna fotoUrl', async () => {
    mockGet.mockResolvedValueOnce({ data: { id: 2, email: 'a@b.com', fotoUrl: '/uploads/prestadores/2.jpg' } })

    const result = await authService.me()

    expect(mockGet).toHaveBeenCalledWith('/auth/me')
    expect(result.fotoUrl).toBe('/uploads/prestadores/2.jpg')
  })
})