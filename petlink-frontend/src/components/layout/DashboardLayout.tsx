import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { colors } from '../../theme/tokens'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: colors.bg }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Topbar />
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>{children}</div>
        </main>
      </div>
    </div>
  )
}
