import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/fraunces'
import '@fontsource-variable/figtree'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { AppRoutes } from './routes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </StrictMode>,
)
