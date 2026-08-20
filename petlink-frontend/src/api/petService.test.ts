import { describe, expect, it, vi, beforeEach } from 'vitest'

vi.mock('./axiosInstance', () => ({
  __esModule: true,
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

import api from './axiosInstance'
import { petService } from './petService'

const mockGet = vi.mocked(api.get)
const mockPost = vi.mocked(api.post)
const mockDelete = vi.mocked(api.delete)

beforeEach(() => vi.clearAllMocks())

describe('petService', () => {
  it('listar chama GET /pets e retorna os pets', async () => {
    mockGet.mockResolvedValueOnce({ data: [{ id: 1, nome: 'Rex' }] })

    const result = await petService.listar()

    expect(mockGet).toHaveBeenCalledWith('/pets')
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ id: 1, nome: 'Rex' })
  })

  it('cadastrar chama POST /pets com o payload', async () => {
    mockPost.mockResolvedValueOnce({ data: { id: 2, nome: 'Mel' } })

    const result = await petService.cadastrar({ nome: 'Mel', especie: 'Gato', raca: '', idade: 3, tutorId: 1 })

    expect(mockPost).toHaveBeenCalledWith('/pets', { nome: 'Mel', especie: 'Gato', raca: '', idade: 3, tutorId: 1 })
    expect(result).toMatchObject({ id: 2 })
  })

  it('remover chama DELETE /pets/{id}', async () => {
    mockDelete.mockResolvedValueOnce({ data: null })

    await petService.remover(5)

    expect(mockDelete).toHaveBeenCalledWith('/pets/5')
  })

  it('uploadFoto envia FormData com o arquivo', async () => {
    mockPost.mockResolvedValueOnce({ data: { id: 3, fotoUrl: '/uploads/pets/3.jpg' } })
    const file = new File(['img'], 'foto.jpg', { type: 'image/jpeg' })

    const result = await petService.uploadFoto(3, file)

    expect(mockPost).toHaveBeenCalledWith(
      '/pets/3/upload-foto',
      expect.any(FormData),
      { headers: { 'Content-Type': 'multipart/form-data' } },
    )
    const formData = mockPost.mock.calls[0][1] as FormData
    expect(formData.get('file')).toEqual(file)
    expect(result.fotoUrl).toBe('/uploads/pets/3.jpg')
  })
})