import Sidebar from './Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F4F7F6' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>{children}</main>
    </div>
  )
}
