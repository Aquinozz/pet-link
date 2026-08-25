import { useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { colors } from '../../theme/tokens'
import { useIsTablet } from '../../hooks/useMediaQuery'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isTablet = useIsTablet()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.bg }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar onMenuClick={isTablet ? () => setSidebarOpen(o => !o) : undefined} />
        <main style={{ flex: 1, overflowY: 'auto', padding: isTablet ? '20px 16px' : '32px 40px' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>{children}</div>
        </main>
      </div>
    </div>
  )
}
