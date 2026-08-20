import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from './AuthContext'
import { useAuth } from './useAuth'
import { makeToken } from '../test/token'

function Harness() {
  const { user, token, tutorId, fotoUrl, signIn, signOut } = useAuth()
  return (
    <div>
      <p data-testid="email">{user?.email ?? 'none'}</p>
      <p data-testid="role">{user?.role ?? 'none'}</p>
      <p data-testid="token">{token ?? 'none'}</p>
      <p data-testid="tutor">{String(tutorId ?? 'none')}</p>
      <p data-testid="foto">{fotoUrl ?? 'none'}</p>
      <button onClick={() => signIn(makeToken({ sub: 'a@b.com', roles: ['ROLE_TUTOR'] }))}>signin</button>
      <button onClick={signOut}>signout</button>
    </div>
  )
}

const renderAuth = () => render(<AuthProvider><Harness /></AuthProvider>)

beforeEach(() => localStorage.clear())

describe('AuthContext', () => {
  it('inicializa deslogado', () => {
    renderAuth()
    expect(screen.getByTestId('email')).toHaveTextContent('none')
    expect(screen.getByTestId('token')).toHaveTextContent('none')
  })

  it('signIn persiste token, usuario e roles no localStorage', async () => {
    const user = userEvent.setup()
    renderAuth()

    await user.click(screen.getByRole('button', { name: 'signin' }))

    expect(screen.getByTestId('email')).toHaveTextContent('a@b.com')
    expect(screen.getByTestId('role')).toHaveTextContent('ROLE_TUTOR')
    const stored = localStorage.getItem('petlink_token')
    expect(stored).not.toBeNull()
    expect(stored?.split('.')).toHaveLength(3)
  })

  it('signOut limpa estado e localStorage', async () => {
    const user = userEvent.setup()
    localStorage.setItem('petlink_token', makeToken({ sub: 'b@c.com', roles: ['ROLE_PROFISSIONAL'] }))
    localStorage.setItem('petlink_prestador_id', '7')
    localStorage.setItem('petlink_foto_url', '/uploads/prestadores/1.jpg')
    renderAuth()

    expect(screen.getByTestId('email')).toHaveTextContent('b@c.com')
    expect(screen.getByTestId('foto')).toHaveTextContent('/uploads/prestadores/1.jpg')

    await user.click(screen.getByRole('button', { name: 'signout' }))

    expect(screen.getByTestId('email')).toHaveTextContent('none')
    expect(screen.getByTestId('role')).toHaveTextContent('none')
    expect(screen.getByTestId('token')).toHaveTextContent('none')
    expect(screen.getByTestId('tutor')).toHaveTextContent('none')
    expect(screen.getByTestId('foto')).toHaveTextContent('none')
    expect(localStorage.getItem('petlink_token')).toBeNull()
    expect(localStorage.getItem('petlink_prestador_id')).toBeNull()
    expect(localStorage.getItem('petlink_foto_url')).toBeNull()
  })

  it('restaura estado persistido ao montar', () => {
    localStorage.setItem('petlink_token', makeToken({ sub: 'd@e.com', roles: ['ROLE_TUTOR'] }))
    localStorage.setItem('petlink_tutor_id', '5')
    renderAuth()

    expect(screen.getByTestId('email')).toHaveTextContent('d@e.com')
    expect(screen.getByTestId('role')).toHaveTextContent('ROLE_TUTOR')
    expect(screen.getByTestId('tutor')).toHaveTextContent('5')
  })
})