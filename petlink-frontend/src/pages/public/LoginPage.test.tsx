import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../../contexts/AuthContext'
import { authService } from '../../api/authService'
import { makeToken } from '../../test/token'
import LoginPage from './LoginPage'

vi.mock('../../api/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    me: vi.fn(),
  },
}))

const loginMock = vi.mocked(authService.login)

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={['/login']}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/redirect" element={<div>redirecionou</div>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  )

beforeEach(() => localStorage.clear())

describe('LoginPage', () => {
  it('preenche credenciais, chama login e navega para /redirect', async () => {
    const token = makeToken({ sub: 'a@b.com', roles: ['ROLE_TUTOR'] })
    loginMock.mockResolvedValueOnce({ token, expiresIn: 900000 })
    const user = userEvent.setup()

    renderLogin()

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'a@b.com')
    await user.type(screen.getByPlaceholderText('Sua senha'), '123456')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(loginMock).toHaveBeenCalledWith({ email: 'a@b.com', senha: '123456' })
    await waitFor(() => expect(screen.getByText('redirecionou')).toBeInTheDocument())
    expect(localStorage.getItem('petlink_token')).toBe(token)
  })

  it('exibe erro quando as credenciais sao invalidas', async () => {
    loginMock.mockRejectedValueOnce(new Error('unauthorized'))
    const user = userEvent.setup()

    renderLogin()

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'x@y.com')
    await user.type(screen.getByPlaceholderText('Sua senha'), 'senha-errada')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText('Email ou senha incorretos.')).toBeInTheDocument()
    expect(localStorage.getItem('petlink_token')).toBeNull()
  })
})