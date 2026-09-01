import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight, Award, Bath, Building2, Camera, Check, ChevronRight, Dog, Heart,
  LayoutDashboard, LogOut, MapPin, Menu, MessageCircle, Percent, PawPrint, Search, ShieldCheck, ShoppingCart, Star, Stethoscope, Store, Truck, User, X,
} from 'lucide-react'
import { BrandLogo } from '../../components/BrandLogo'
import { Button } from '../../components/ui/Button'
import { StarRating } from '../../components/ui/StarRating'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { colors, radius, shadow, fontFamily } from '../../theme/tokens'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { stepPhotos, testimonialPhotos, ctaPhoto } from './landingPhotos'
import { prestadorService } from '../../api/prestadorService'
import type { PrestadorResponseDto } from '../../types'
import { useAuth } from '../../contexts/useAuth'

const container: React.CSSProperties = { maxWidth: 1120, margin: '0 auto' }
const sectionPad = (isMobile: boolean) => (isMobile ? '64px 20px' : '96px 32px')

function Reveal({ children, style, delay }: { children: React.ReactNode; style?: React.CSSProperties; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        obs.disconnect()
      }
    }, { threshold: 0.12 })
    if (delay) {
      setTimeout(() => obs.observe(el), delay)
    } else {
      obs.observe(el)
    }
    return () => obs.disconnect()
  }, [delay])
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(12px)',
        transition: 'opacity 0.5s ease, transform 0.5s ease',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function Eyebrow({ children, color = colors.brand[600] }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{ fontFamily: fontFamily.display, fontStyle: 'italic', fontSize: 18, fontWeight: 500, color, marginBottom: 14 }}>
      {children}
    </p>
  )
}

/* ------------------------------- NAVBAR ------------------------------- */

/* Cores exatas extraídas do globals.css original do Zoop-Site (referência do colega) */
const Z = {
  dark: '#002724',
  darkText: '#16332e',
  bodyText: '#254640',
  muted: '#61726b',
  border: '#dce6d7',
  primary: '#5a8f2b',
  accentLime: '#9bd45b',
  secondaryBg: '#e8f0e2',
}

const navIconBtn: React.CSSProperties = {
  position: 'relative',
  width: 42,
  height: 42,
  display: 'grid',
  placeItems: 'center',
  color: colors.white,
  background: 'transparent',
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  textDecoration: 'none',
}

function Navbar() {
  const { isAuthenticated, user, signOut, fotoUrl } = useAuth()
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 920px)')
  const isSmallMobile = useMediaQuery('(max-width: 480px)')
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const links = [
    { href: '#', label: 'Início' },
    { href: '#produtos-destaque', label: 'Produtos' },
    { href: '#servicos', label: 'Serviços' },
    { href: '#como-funciona', label: 'Clínicas' },
    { href: '/tutor/prestadores', label: 'Profissionais' },
    { href: '#cuidados', label: 'Cuidados' },
  ]

  const getDashboardPath = () => {
    if (user?.role === 'ROLE_PROFISSIONAL') return '/prestador/dashboard'
    if (user?.role === 'ROLE_ADMIN') return '/admin/dashboard'
    return '/tutor/dashboard'
  }

  const handleLogout = () => {
    setUserMenuOpen(false)
    signOut()
    navigate('/login')
  }

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const username = user?.email?.split('@')[0] ?? ''
  const logoW = isMobile ? 130 : 184
  const logoH = isMobile ? 48 : 68

  return (
    <header style={{ position: 'relative', zIndex: 20, backgroundColor: Z.dark, color: colors.white, boxShadow: '0 12px 28px rgba(0,39,36,0.08)' }}>
      <div style={{ background: 'linear-gradient(90deg, #4d7f1e, #6aa42c 52%, #4e801f)', color: colors.white, fontWeight: 650 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', minHeight: isMobile ? 37 : 42, display: 'flex', alignItems: 'center', justifyContent: isMobile ? 'flex-start' : 'center', gap: isMobile ? 34 : 'clamp(40px, 6vw, 120px)', overflowX: isMobile ? 'auto' : 'visible', fontSize: isMobile ? 12 : 14.4 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}><Truck size={20} /> Frete grátis acima de R$ 129</span>
          {!isSmallMobile && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}><Percent size={20} /> 10% OFF na primeira compra</span>}
          {!isMobile && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}><ShieldCheck size={20} /> Agendamento fácil e seguro</span>}
        </div>
      </div>

      <div style={{
        maxWidth: 1400, margin: '0 auto', padding: isMobile ? '10px 24px 14px' : '0 24px',
        minHeight: isMobile ? 88 : 92,
        display: 'grid',
        gridTemplateColumns: isMobile ? `${logoW}px 1fr` : '220px minmax(320px, 660px) 1fr',
        gridTemplateRows: isMobile ? 'auto auto' : undefined,
        gap: isMobile ? 12 : 24,
        alignItems: 'center',
      }}>
        <Link
          to="/"
          onClick={e => { if (window.location.pathname === '/') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) } }}
          style={{ width: logoW, height: logoH, display: 'block', overflow: 'hidden', borderRadius: 6, flex: '0 0 auto' }}
        >
          <img src="/zoop-logo-source.png" alt="Zoop" style={{ width: logoW, maxWidth: 'none', height: 'auto', display: 'block', transform: 'translateY(-5px)' }} />
        </Link>

        <div style={{
          gridColumn: isMobile ? '1 / -1' : undefined,
          gridRow: isMobile ? 2 : undefined,
          height: isMobile ? 48 : 56,
          display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px',
          backgroundColor: colors.white, border: '1px solid rgba(255,255,255,0.75)', borderRadius: 999, boxShadow: '0 8px 22px rgba(0,0,0,0.12)',
        }}>
          <Search size={22} color={Z.dark} style={{ flexShrink: 0 }} />
          <input
            placeholder="O que você procura para o seu pet?"
            style={{ flex: 1, height: '100%', border: 'none', outline: 'none', background: 'transparent', color: Z.darkText, fontSize: 15, fontFamily: 'inherit', minWidth: 0 }}
          />
        </div>

        <div style={{ gridColumn: isMobile ? 2 : undefined, gridRow: isMobile ? 1 : undefined, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: isMobile ? 2 : 6 }}>
          {!isMobile && (
            <>
              <button aria-label="Selecionar localização" style={navIconBtn}><MapPin size={24} strokeWidth={1.8} /></button>
              <button aria-label="Favoritos" style={navIconBtn}><Heart size={24} strokeWidth={1.8} /></button>
              {isAuthenticated ? (
                <div style={{ position: 'relative' }} ref={userMenuRef}>
                  <button onClick={() => setUserMenuOpen(o => !o)} aria-label="Menu do usuário" style={navIconBtn}>
                    <Avatar src={fotoUrl ?? undefined} name={username} size={28} />
                  </button>
                  {userMenuOpen && (
                    <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 10, minWidth: 200, backgroundColor: colors.white, border: `1px solid ${colors.border}`, borderRadius: radius.lg, boxShadow: shadow.md, padding: 8, zIndex: 20 }}>
                      <div style={{ padding: '8px 12px', borderBottom: `1px solid ${colors.border}`, marginBottom: 4 }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: colors.gray[900], margin: 0 }}>{username}</p>
                        <p style={{ fontSize: 12, color: colors.gray[500], margin: 0 }}>{user?.role?.replace('ROLE_', '')}</p>
                      </div>
                      <Link to={getDashboardPath()} onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: radius.md, fontSize: 14, color: colors.gray[700], textDecoration: 'none' }}>
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: 'none', background: 'transparent', borderRadius: radius.md, cursor: 'pointer', fontSize: 14, color: colors.danger[600] }} onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.danger[50] }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}>
                        <LogOut size={16} /> Sair
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" aria-label="Entrar" style={navIconBtn}>
                  <User size={24} strokeWidth={1.8} />
                </Link>
              )}
            </>
          )}
          <button aria-label="Carrinho" style={navIconBtn} onClick={() => navigate(isAuthenticated ? getDashboardPath() : '/login')}>
            <ShoppingCart size={24} strokeWidth={1.8} />
          </button>
          {isMobile && (
            <button onClick={() => setOpen(o => !o)} aria-label="Abrir menu" style={navIconBtn}>
              {open ? <X size={24} strokeWidth={1.8} /> : <Menu size={24} strokeWidth={1.8} />}
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? (open ? '8px 24px 18px' : 0) : '0 24px', display: isMobile && !open ? 'none' : 'flex', alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 24, minHeight: isMobile ? undefined : 56 }}>
        <nav style={{ display: isMobile ? 'grid' : 'flex', gridTemplateColumns: isMobile ? '1fr 1fr' : undefined, gap: isMobile ? 4 : 'clamp(28px, 3.5vw, 66px)', alignItems: 'center' }}>
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                padding: isMobile ? '12px' : '17px 0 15px',
                borderRadius: isMobile ? 10 : 0,
                color: 'rgba(255,255,255,0.92)',
                textDecoration: 'none',
                fontWeight: 650,
                fontSize: 15,
              }}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Link
          to={isAuthenticated ? getDashboardPath() : '/login'}
          onClick={() => setOpen(false)}
          style={{
            minWidth: 128, height: 40, padding: '0 22px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 999, background: 'linear-gradient(90deg, #5a8f2b, #74aa31)',
            color: colors.white, fontWeight: 800, fontSize: 14, textDecoration: 'none',
            boxShadow: '0 8px 16px rgba(30,80,12,0.24)',
          }}
        >
          {isAuthenticated ? 'Dashboard' : 'Entrar'}
        </Link>
      </div>
    </header>
  )
}

/* --------------------------- MOCKUPS DO PRODUTO --------------------------- */

function ScreenFrame({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <div style={{ borderRadius: radius.xl, border: `1px solid ${colors.border}`, backgroundColor: colors.white, boxShadow: shadow.md, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 16px', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.gray[50] }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colors.gray[200] }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colors.gray[200] }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: colors.gray[200] }} />
        {title && <span style={{ fontSize: 12, color: colors.gray[400], marginLeft: 8 }}>{title}</span>}
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  )
}

function ProvidersMock() {
  const providers = [
    { name: 'Dr. Carlos Mendes', city: 'São Paulo, SP', type: 'Veterinário', rating: 4.8, tags: ['Consultas', 'Vacinas'] },
    { name: 'Clínica Pet Feliz', city: 'Salvador, BA', type: 'Clínica', rating: 5, tags: ['Emergência', 'Cirurgia'] },
  ]
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: colors.gray[900] }}>Prestadores</p>
        <span style={{ fontSize: 12, color: colors.gray[400] }}>128 disponíveis</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: radius.md, border: `1px solid ${colors.border}`, backgroundColor: colors.gray[50], color: colors.gray[400], fontSize: 12, marginBottom: 12 }}>
        <Search size={13} /> Buscar por nome, cidade ou serviço
      </div>
      {providers.map((p, i) => (
        <div key={p.name} style={{ padding: '12px 0', borderBottom: i < providers.length - 1 ? `1px solid ${colors.border}` : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Avatar name={p.name} size={36} />
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: colors.gray[900] }}>{p.name}</p>
              <p style={{ fontSize: 11, color: colors.gray[400] }}>{p.city}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
              <StarRating value={p.rating} size={11} />
              <Badge tone="green">{p.type}</Badge>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {p.tags.map(t => (
              <span key={t} style={{ fontSize: 10, backgroundColor: colors.brand[50], color: colors.brand[800], padding: '2px 8px', borderRadius: 20, fontWeight: 600, border: `1px solid ${colors.border}` }}>{t}</span>
            ))}
            {i === 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginLeft: 'auto', padding: '5px 10px', borderRadius: radius.md, backgroundColor: colors.brand[600], color: colors.white, fontSize: 11, fontWeight: 600 }}>
                <MessageCircle size={11} /> WhatsApp
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

function PetsMock() {
  const pets = [
    { name: 'Rex', meta: 'Cachorro • Labrador', icon: <Dog size={26} /> },
    { name: 'Mel', meta: 'Gato • SRD', icon: <PawPrint size={26} /> },
  ]
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: colors.gray[900] }}>Meus Pets</p>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: radius.md, backgroundColor: colors.brand[600], color: colors.white, fontSize: 11, fontWeight: 600 }}>+ Novo pet</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {pets.map(p => (
          <div key={p.name} style={{ border: `1px solid ${colors.border}`, borderRadius: radius.lg, padding: 12 }}>
            <div style={{ position: 'relative', height: 76, borderRadius: radius.md, backgroundColor: colors.brand[50], display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.brand[600], marginBottom: 8 }}>
              {p.icon}
              <span style={{ position: 'absolute', bottom: 6, right: 6, width: 22, height: 22, borderRadius: '50%', backgroundColor: colors.brand[600], color: colors.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Camera size={11} />
              </span>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: colors.gray[900] }}>{p.name}</p>
            <p style={{ fontSize: 11, color: colors.gray[400] }}>{p.meta}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AgendaMock() {
  const rows = [
    { name: 'Bianca', status: 'CONFIRMADO', meta: '🐾 Rex • 12/07 às 14h' },
    { name: 'Rafael', status: 'AGENDADO', meta: '🐾 Nina • 15/07 às 09h' },
  ]
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: colors.gray[900] }}>Minha agenda</p>
        <span style={{ fontSize: 12, color: colors.gray[400] }}>Próximos</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {rows.map(r => (
          <div key={r.name} style={{ padding: 12, border: `1px solid ${colors.border}`, borderRadius: radius.lg }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: colors.gray[900] }}>{r.name}</p>
              <StatusBadge status={r.status} />
            </div>
            <p style={{ fontSize: 12, color: colors.gray[500], marginBottom: 8 }}>{r.meta}</p>
            {r.status === 'AGENDADO' && (
              <div style={{ display: 'flex', gap: 6 }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: radius.sm, backgroundColor: colors.brand[600], color: colors.white, fontSize: 11, fontWeight: 600 }}><Check size={11} /> Confirmar</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: radius.sm, border: `1px solid ${colors.border}`, color: colors.gray[500], fontSize: 11, fontWeight: 600 }}>Cancelar</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* --------------------------------- HERO --------------------------------- */

const categorias = [
  { label: 'Veterinário', icon: <Stethoscope size={31} strokeWidth={1.7} /> },
  { label: 'Banho & Tosa', icon: <Bath size={31} strokeWidth={1.7} /> },
  { label: 'Pet sitter', icon: <Dog size={31} strokeWidth={1.7} /> },
  { label: 'Hotel para pets', icon: <Building2 size={31} strokeWidth={1.7} /> },
  { label: 'Adestramento', icon: <Award size={31} strokeWidth={1.7} /> },
]

const produtosDestaque = [
  { nome: 'Ração Premier Fórmula', desc: 'Cães adultos · 15 kg', preco: 189.9, rating: 5, reviews: 1256, img: '/product-premier.png' },
  { nome: 'Ração Gran Plus', desc: 'Gatos castrados · 10,1 kg', preco: 159.9, rating: 5, reviews: 982, img: '/product-granplus.png' },
  { nome: 'NexGard Spectra', desc: 'Antipulgas e carrapatos', preco: 99.9, rating: 5, reviews: 743, img: '/product-nexgard.png' },
]

const heroBtnBase: React.CSSProperties = {
  minHeight: 49,
  padding: '0 24px',
  borderRadius: 12,
  fontWeight: 800,
  fontSize: 15,
  border: 'none',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  fontFamily: 'inherit',
  textDecoration: 'none',
}

function Hero() {
  const isMobile = useMediaQuery('(max-width: 920px)')
  const [topAvaliados, setTopAvaliados] = useState<PrestadorResponseDto[]>([])
  const [busca, setBusca] = useState({ servico: '', local: 'Salvador, BA' })
  const navigate = useNavigate()

  useEffect(() => {
    prestadorService.listarTopAvaliados(2).then(setTopAvaliados).catch(() => {})
  }, [])

  return (
    <div style={{ backgroundColor: colors.bg }}>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: isMobile ? '20px 24px 0' : '24px 24px 0' }}>

        {/* HERO */}
        <section style={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: isMobile ? undefined : 354,
          display: isMobile ? 'block' : 'grid',
          gridTemplateColumns: isMobile ? undefined : '54% 46%',
          borderRadius: isMobile ? 22 : 30,
          boxShadow: '0 18px 48px rgba(0,39,36,0.12)',
          background: isMobile ? colors.bg : 'linear-gradient(120deg, #fffdfb 0%, #f9f7f6 58%, #002724 58%)',
          paddingBottom: isMobile ? 250 : undefined,
        }}>
          <div style={{ position: 'absolute', left: -60, bottom: isMobile ? 130 : -105, width: 260, height: 170, background: Z.primary, borderRadius: '50%', zIndex: 0 }} />

          <div style={{ position: 'relative', zIndex: 3, padding: isMobile ? '28px 22px 34px' : '38px 36px 50px 64px' }}>
            <span style={{ display: 'inline-block', marginBottom: 14, padding: '6px 14px', borderRadius: 999, backgroundColor: Z.secondaryBg, color: '#406c1d', border: '1px solid #d8e7cd', fontSize: 13, fontWeight: 700 }}>
              Cuidado completo para o seu pet
            </span>
            <h1 style={{ margin: 0, color: '#002724', fontSize: isMobile ? 'clamp(2.1rem, 9vw, 3.2rem)' : 'clamp(2.5rem, 4vw, 4.1rem)', lineHeight: isMobile ? 1.05 : 0.98, letterSpacing: '-0.04em', fontWeight: 800 }}>
              Conectando quem <span style={{ color: Z.primary }}>ama</span>,<br />
              com quem <span style={{ color: Z.primary }}>cuida.</span>
            </h1>
            <p style={{ maxWidth: 500, margin: isMobile ? '14px 0 18px' : '18px 0 22px', color: Z.bodyText, fontSize: isMobile ? 16 : 17.9, lineHeight: 1.55 }}>
              Produtos, serviços e profissionais para cuidar do seu pet em um só lugar.
            </p>
            <div style={{ display: isMobile ? 'grid' : 'flex', flexWrap: 'wrap', gap: 14 }}>
              <Link to="/tutor/prestadores" style={{ ...heroBtnBase, backgroundColor: Z.primary, color: colors.white }}>
                Encontrar profissionais
              </Link>
              <a href="#produtos-destaque" style={{ ...heroBtnBase, color: '#002724', border: '2px solid #002724', backgroundColor: 'rgba(255,255,255,0.82)' }}>
                Ver produtos
              </a>
            </div>
          </div>

          {!isMobile ? (
            <div style={{ position: 'relative', zIndex: 2, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: '0 auto 0 0', zIndex: 2, width: 110, background: 'linear-gradient(90deg, #f9f7f6, transparent)', pointerEvents: 'none' }} />
              <img src="/hero-pets.png" alt="Cachorro golden retriever e gato juntos" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ position: 'absolute', right: 0, bottom: 0, left: 0, height: 260, backgroundColor: '#002724', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: '0 0 auto 0', width: '100%', height: 60, background: 'linear-gradient(#f9f7f6, transparent)', zIndex: 2 }} />
              <img src="/hero-pets.png" alt="Cachorro golden retriever e gato juntos" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </section>

        {/* SERVICE SHORTCUTS */}
        <div style={{
          position: 'relative', zIndex: 8,
          marginTop: isMobile ? 20 : -34,
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(5, minmax(150px, 1fr))' : 'repeat(5, 1fr)',
          gap: 16,
          padding: isMobile ? 0 : '0 76px',
          overflowX: isMobile ? 'auto' : 'visible',
        }}>
          {categorias.map(c => (
            <a key={c.label} href="#servicos" style={{
              minHeight: 116, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
              color: Z.darkText, backgroundColor: colors.white, border: '1px solid rgba(0,39,36,0.08)', borderRadius: 17,
              boxShadow: '0 9px 24px rgba(0,39,36,0.11)', textDecoration: 'none', fontWeight: 750, fontSize: 14,
            }}>
              <span style={{ width: 49, height: 49, display: 'grid', placeItems: 'center', color: '#002724', backgroundColor: '#f0f5ec', borderRadius: 15 }}>{c.icon}</span>
              {c.label}
            </a>
          ))}
        </div>

        {/* CONTENT GRID */}
        <div id="produtos-destaque" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1.85fr) minmax(340px, 1fr)', gap: 28, alignItems: 'start', marginTop: 20, paddingBottom: isMobile ? 40 : 72 }}>

          {/* CATALOG COLUMN */}
          <div style={{ minWidth: 0 }}>
            <div style={{
              minHeight: isMobile ? undefined : 56, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.74)', border: `1px solid ${Z.border}`, borderRadius: 14,
              padding: isMobile ? '12px 0' : 0, gap: isMobile ? 10 : 0,
            }}>
              <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontSize: 14.7, fontWeight: 650, color: Z.darkText, borderRight: isMobile ? 'none' : `1px solid ${Z.border}`, borderTop: isMobile ? `1px solid ${Z.border}` : 'none', paddingTop: isMobile ? 10 : 0 }}>
                <Truck size={25} color="#002724" /> Frete grátis acima de R$ 129
              </span>
              <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontSize: 14.7, fontWeight: 650, color: Z.darkText }}>
                <Percent size={25} color="#002724" /> 10% OFF na primeira compra
              </span>
            </div>

            <section style={{ marginTop: 16, padding: '22px 16px 18px', backgroundColor: 'rgba(255,255,255,0.68)', border: '1px solid #e1e8dd', borderRadius: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, margin: '0 2px 16px' }}>
                <div>
                  <span style={{ display: 'block', marginBottom: 3, color: Z.primary, fontSize: 11.7, fontWeight: 850, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Seleção Zoop</span>
                  <h2 style={{ margin: 0, color: '#002724', fontSize: 21, lineHeight: 1.2, fontWeight: 800 }}>Produtos em destaque</h2>
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#4a7c22', fontSize: 13.4, fontWeight: 800 }}>
                  Ver todos <ChevronRight size={17} />
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
                {produtosDestaque.map(p => (
                  <div key={p.nome} style={{
                    minHeight: 220, display: 'grid', gridTemplateColumns: '104px minmax(0, 1fr)', gap: 10, padding: 12,
                    backgroundColor: colors.white, border: '1px solid rgba(0,39,36,0.09)', borderRadius: 15, boxShadow: '0 7px 18px rgba(0,39,36,0.07)', overflow: 'hidden',
                  }}>
                    <img src={p.img} alt={p.nome} style={{ width: 104, height: 188, alignSelf: 'center', objectFit: 'cover', borderRadius: 11 }} />
                    <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 8, padding: '6px 0 3px' }}>
                      <div>
                        <h3 style={{ margin: 0, color: Z.darkText, fontSize: 13.8, lineHeight: 1.25, fontWeight: 700 }}>{p.nome}</h3>
                        <p style={{ margin: '4px 0 0', color: Z.muted, fontSize: 12, lineHeight: 1.35 }}>{p.desc}</p>
                      </div>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#50615a', fontSize: 11.8 }}>
                        <Star size={14} fill="#f5b700" color="#f5b700" /> {p.rating.toFixed(1)} ({p.reviews})
                      </span>
                      <strong style={{ color: '#002724', fontSize: 17.9, fontWeight: 700 }}>R$ {p.preco.toFixed(2).replace('.', ',')}</strong>
                      <Button size="sm" disabled title="Catálogo de produtos ainda não disponível" style={{ alignSelf: 'flex-start', borderRadius: 9 }}>
                        Adicionar <ShoppingCart size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* CARE FINDER */}
          <aside style={{ padding: 22, background: 'linear-gradient(145deg, #edf4e9, #e5efe0)', border: '1px solid #d6e4d0', borderRadius: 20, boxShadow: '0 10px 24px rgba(0,39,36,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 17 }}>
              <span style={{ width: 45, height: 45, display: 'grid', placeItems: 'center', color: colors.white, backgroundColor: Z.primary, borderRadius: 14, flexShrink: 0 }}>
                <PawPrint size={25} />
              </span>
              <div>
                <span style={{ display: 'block', color: Z.primary, fontSize: 11.2, fontWeight: 850, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Rede Zoop</span>
                <h2 style={{ margin: 0, color: '#002724', fontSize: 21, lineHeight: 1.2, fontWeight: 800 }}>Encontre cuidado perto de você</h2>
              </div>
            </div>

            <form onSubmit={e => { e.preventDefault(); navigate('/tutor/prestadores') }} style={{ display: 'grid', gap: 10 }}>
              <label>
                <span style={{ display: 'block', margin: '0 0 5px 3px', color: '#3c554e', fontSize: 11.5, fontWeight: 750 }}>Serviço</span>
                <div style={{ minHeight: 42, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', backgroundColor: colors.white, border: '1px solid #c8d5c5', borderRadius: 10 }}>
                  <Search size={17} color="#002724" />
                  <input
                    value={busca.servico}
                    onChange={e => setBusca(b => ({ ...b, servico: e.target.value }))}
                    placeholder="Serviço ou especialidade"
                    style={{ flex: 1, height: 40, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontFamily: 'inherit', color: Z.darkText, minWidth: 0 }}
                  />
                </div>
              </label>
              <label>
                <span style={{ display: 'block', margin: '0 0 5px 3px', color: '#3c554e', fontSize: 11.5, fontWeight: 750 }}>Localização</span>
                <div style={{ minHeight: 42, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', backgroundColor: colors.white, border: '1px solid #c8d5c5', borderRadius: 10 }}>
                  <MapPin size={17} color="#002724" />
                  <input
                    value={busca.local}
                    onChange={e => setBusca(b => ({ ...b, local: e.target.value }))}
                    placeholder="Cidade ou bairro"
                    style={{ flex: 1, height: 40, border: 'none', outline: 'none', background: 'transparent', fontSize: 14, fontFamily: 'inherit', color: Z.darkText, minWidth: 0 }}
                  />
                </div>
              </label>
              <button type="submit" style={{ height: 42, marginTop: 2, backgroundColor: '#002724', color: colors.white, border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                Buscar
              </button>
            </form>

            {topAvaliados.length > 0 && (
              <div style={{ display: 'grid', gap: 8, marginTop: 14 }}>
                {topAvaliados.map(p => (
                  <Link key={p.id} to={`/prestadores/${p.id}`} style={{
                    minWidth: 0, display: 'grid', gridTemplateColumns: '48px minmax(0, 1fr) auto', alignItems: 'center', gap: 10, padding: 10,
                    backgroundColor: colors.white, border: '1px solid rgba(0,39,36,0.07)', borderRadius: 12, textDecoration: 'none',
                  }}>
                    <Avatar src={p.fotoUrl} name={p.nomePrestador} size={46} />
                    <div style={{ minWidth: 0 }}>
                      <h3 style={{ overflow: 'hidden', margin: 0, color: Z.darkText, fontSize: 13.8, fontWeight: 800, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.nomePrestador}</h3>
                      <p style={{ margin: '2px 0 4px', color: Z.muted, fontSize: 11.5 }}>{p.type}</p>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#53645e', fontSize: 10.9 }}>
                        <Star size={14} fill="#f5b700" color="#f5b700" /> {(p.avaliacaoMedia ?? 0).toFixed(1)} <b>•</b> {p.bairro}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', lineHeight: 1.1 }}>
                      <Badge tone="green" style={{ marginBottom: 6, color: '#315f1a', backgroundColor: '#dcefd3', fontSize: 9.9 }}>Disponível hoje</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </aside>
        </div>

        {/* CARE MESSAGE */}
        <section style={{
          marginBottom: isMobile ? 40 : 72,
          display: isMobile ? 'block' : 'grid',
          gridTemplateColumns: isMobile ? undefined : '145px minmax(0, 1fr) auto',
          alignItems: 'center', gap: 28, padding: isMobile ? 24 : '24px 30px',
          backgroundColor: '#002724', borderRadius: 24, boxShadow: '0 16px 34px rgba(0,39,36,0.16)', overflow: 'hidden',
        }}>
          <img src="/zoop-symbol-source.png" alt="Símbolo Zoop com cachorro e gato" style={{ width: isMobile ? 96 : 132, height: isMobile ? 96 : 132, objectFit: 'cover', borderRadius: 18, float: isMobile ? 'right' : undefined, margin: isMobile ? '0 0 12px 16px' : undefined }} />
          <div>
            <span style={{ display: 'block', margin: '3px 0 8px', color: Z.accentLime, fontSize: 11.7, fontWeight: 850, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Quem ama, cuida</span>
            <h2 style={{ maxWidth: 650, margin: '3px 0 8px', color: colors.white, fontSize: isMobile ? 23 : 'clamp(1.45rem, 2.3vw, 2.25rem)', lineHeight: 1.1, letterSpacing: '-0.025em', fontWeight: 700 }}>
              Uma rede de confiança para cada fase da vida do seu pet.
            </h2>
            <p style={{ maxWidth: 670, margin: 0, color: 'rgba(255,255,255,0.72)', fontSize: 15 }}>
              Descubra profissionais, serviços e conteúdos selecionados para tornar o cuidado mais simples e seguro.
            </p>
          </div>
          <a href="#como-funciona" style={{ ...heroBtnBase, marginTop: isMobile ? 18 : 0, color: colors.white, border: '1px solid rgba(255,255,255,0.48)', backgroundColor: 'rgba(255,255,255,0.07)' }}>
            Conhecer a Zoop <ChevronRight size={17} />
          </a>
        </section>
      </div>
    </div>
  )
}

/* ------------------------------- PROBLEMA ------------------------------- */

function Problema() {
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const dores = [
    { num: '01', title: 'Confiar sem conhecer', desc: 'Como saber se um profissional é bom antes de confiar o seu pet?' },
    { num: '02', title: 'Perder tempo procurando', desc: 'Ligar um por um, em horário comercial, é lento e frustrante.' },
    { num: '03', title: 'Decidir sem informação', desc: 'Poucos dados, poucas avaliações e muita incerteza na escolha.' },
  ]
  return (
    <section data-anchor style={{ padding: sectionPad(isMobile), backgroundColor: colors.white }}>
      <div style={{ ...container, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.9fr 1.1fr', gap: isMobile ? 40 : 80 }}>
        <div>
          <Reveal>
            <Eyebrow>O problema</Eyebrow>
            <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 640, color: colors.gray[900], lineHeight: 1.2, margin: 0 }}>
              Cuidar de um pet é uma responsabilidade de todo dia
            </h2>
          </Reveal>
        </div>
        <div>
          <Reveal>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {dores.map(d => (
                <div key={d.num} style={{ padding: '22px 0', borderBottom: `1px solid ${colors.border}` }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: colors.brand[600], marginBottom: 6 }}>{d.num}</p>
                  <p style={{ fontSize: 16, fontWeight: 700, color: colors.gray[900], marginBottom: 4 }}>{d.title}</p>
                  <p style={{ fontSize: 14, color: colors.gray[500], margin: 0, lineHeight: 1.6 }}>{d.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- COMO FUNCIONA ---------------------------- */

function ComoFunciona() {
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const steps = [
    { num: '01', title: 'Crie sua conta', desc: 'Cadastre-se e adicione o perfil do seu pet em menos de um minuto.' },
    { num: '02', title: 'Encontre profissionais', desc: 'Filtre por localização, serviço e avaliações reais de outros tutores.' },
    { num: '03', title: 'Agende pelo WhatsApp', desc: 'Fale direto com o prestador e confirme o horário na hora.' },
  ]
  return (
    <section id="como-funciona" style={{ padding: sectionPad(isMobile), backgroundColor: colors.bg }}>
      <div style={container}>
        <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
          <Eyebrow>Como funciona</Eyebrow>
          <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 640, color: colors.gray[900], lineHeight: 1.2, margin: 0 }}>
            Três passos até o cuidado ideal
          </h2>
        </Reveal>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? 36 : 48 }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ position: 'relative' }}>
                <div style={{
                  borderRadius: radius.xl,
                  overflow: 'hidden',
                  aspectRatio: '4 / 3',
                  boxShadow: shadow.sm,
                  marginBottom: 20,
                }}>
                  <img src={stepPhotos[i].src} alt={stepPhotos[i].alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <p style={{ fontFamily: fontFamily.display, fontStyle: 'italic', fontSize: 40, fontWeight: 600, color: colors.brand[200], lineHeight: 1, marginBottom: 12, fontFeatureSettings: '"tnum"' }}>{s.num}</p>
                <div style={{ width: 32, height: 3, borderRadius: 2, backgroundColor: colors.brand[600], marginBottom: 16 }} />
                <h3 style={{ fontSize: 18, fontWeight: 700, color: colors.gray[900], marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: colors.gray[500], lineHeight: 1.6, margin: 0, maxWidth: 260 }}>{s.desc}</p>
                {!isMobile && i < steps.length - 1 && (
                  <div style={{ position: 'absolute', right: -24, top: 12, color: colors.brand[400] }}>
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* --------------------------- MOSTRAR O PRODUTO --------------------------- */

function Produto() {
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const rows = [
    {
      eyebrow: 'Encontre',
      title: 'Profissionais com perfil completo',
      desc: 'Explore avaliações, serviços, horários e localização de cada profissional antes de entrar em contato.',
      visual: <ProvidersMock />,
      flip: false,
    },
    {
      eyebrow: 'Organize',
      title: 'Seus pets em um só lugar',
      desc: 'Cadastre todos os seus pets com foto, raça e espécie. Tudo acessível na hora de agendar.',
      visual: <PetsMock />,
      flip: true,
    },
    {
      eyebrow: 'Acompanhe',
      title: 'Agendamentos sem fricção',
      desc: 'Acompanhe cada solicitação, confirme ou cancele — com avisos claros de status para os dois lados.',
      visual: <AgendaMock />,
      flip: false,
    },
  ]
  return (
    <section id="produto" data-anchor style={{ padding: sectionPad(isMobile), backgroundColor: colors.white }}>
      <div style={container}>
        <Reveal style={{ maxWidth: 640, marginBottom: 64 }}>
          <Eyebrow>O produto</Eyebrow>
          <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 640, color: colors.gray[900], lineHeight: 1.2, marginBottom: 12 }}>
            Feito para facilitar o cuidado no dia a dia
          </h2>
          <p style={{ fontSize: 16, color: colors.gray[500], lineHeight: 1.7, margin: 0 }}>
            Tudo o que você precisa para encontrar, agendar e acompanhar — em uma interface simples.
          </p>
        </Reveal>

        <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? 64 : 88 }}>
          {rows.map((row, i) => (
            <Reveal key={row.title}>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 32 : 56, alignItems: 'center' }}>
                {(!row.flip || isMobile) && (
                  <div>
                    <ScreenFrame title={['Buscando um profissional', 'Meus pets', 'Minha agenda'][i]}>
                      {row.visual}
                    </ScreenFrame>
                  </div>
                )}
                <div>
                  <Eyebrow>{row.eyebrow}</Eyebrow>
                  <h3 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 640, color: colors.gray[900], lineHeight: 1.25, marginBottom: 12 }}>{row.title}</h3>
                  <p style={{ fontSize: 15, color: colors.gray[500], lineHeight: 1.7, margin: 0, maxWidth: 420 }}>{row.desc}</p>
                </div>
                {row.flip && !isMobile && (
                  <div>
                    <ScreenFrame title={['Buscando um profissional', 'Meus pets', 'Minha agenda'][i]}>
                      {row.visual}
                    </ScreenFrame>
                  </div>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- SERVIÇOS ------------------------------- */

function Servicos() {
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const servicos = [
    { icon: <Stethoscope size={22} />, name: 'Veterinário', desc: 'Consultas, vacinas e emergências' },
    { icon: <Building2 size={22} />, name: 'Clínica Veterinária', desc: 'Estrutura completa para o seu pet' },
    { icon: <Store size={22} />, name: 'Pet Shop', desc: 'Produtos e cuidados de rotina' },
    { icon: <Bath size={22} />, name: 'Banho e Tosa', desc: 'Higiene e bem-estar' },
    { icon: <Dog size={22} />, name: 'Passeador', desc: 'Passeios com segurança' },
    { icon: <Heart size={22} />, name: 'Creche Pet', desc: 'Cuidado durante o dia' },
  ]
  return (
    <section id="servicos" data-anchor style={{ padding: sectionPad(isMobile), backgroundColor: colors.brand[900] }}>
      <div style={{ ...container, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.9fr 1.1fr', gap: isMobile ? 40 : 64, alignItems: 'start' }}>
        <div>
          <Reveal>
            <Eyebrow color={colors.brand[200]}>Cuidado completo</Eyebrow>
            <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 640, color: colors.white, lineHeight: 1.2, marginBottom: 16 }}>
              Profissionais para cada necessidade
            </h2>
            <p style={{ fontSize: 16, color: colors.brand[200], lineHeight: 1.7, margin: 0, maxWidth: 400 }}>
              Do cuidado rotineiro às emergências, encontre quem entende do seu pet e do seu momento.
            </p>
          </Reveal>
        </div>
        <div>
          <Reveal>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              {servicos.map(s => (
                <div key={s.name} style={{ backgroundColor: colors.brand[800], borderRadius: radius.lg, padding: 18, border: `1px solid ${colors.brand[700]}` }}>
                  <div style={{ width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.brand[50], display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.brand[800], marginBottom: 12 }}>
                    {s.icon}
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: colors.white, marginBottom: 4 }}>{s.name}</p>
                  <p style={{ fontSize: 12, color: colors.brand[200], margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ----------------------------- DEPOIMENTOS ----------------------------- */

function Avaliacoes() {
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const featured = {
    nome: 'Ana Souza', pet: 'Tutora de Mel, uma gata', nota: 5,
    texto: 'Marquei consulta para a Mel num domingo à noite e na segunda de manhã já estávamos no consultório. Li todas as avaliações antes de escolher — ajudou demais.',
  }
  const others = [
    { nome: 'Carlos Mendes', pet: 'Tutor de Rex', nota: 5, texto: 'O banho do Rex era aquele telefone ocupado de sempre. Agora é mensagem no WhatsApp e resolvido.' },
    { nome: 'Juliana Lima', pet: 'Tutora de Pepê', nota: 4, texto: 'Horário de funcionamento e serviços certinhos no perfil. Escolhi em cinco minutos, sem ligar pra ninguém.' },
  ]
  return (
    <section id="depoimentos" data-anchor style={{ padding: sectionPad(isMobile), backgroundColor: colors.brand[50] }}>
      <div style={container}>
        <Reveal style={{ maxWidth: 560, marginBottom: 48 }}>
          <Eyebrow>Depoimentos</Eyebrow>
          <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 640, color: colors.gray[900], lineHeight: 1.2, margin: 0 }}>
            Tutores que já confiam no Zoop
          </h2>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.15fr 1fr', gap: 20 }}>
          <Reveal>
            <div style={{ backgroundColor: colors.white, borderRadius: radius.xl, padding: 32, border: `1px solid ${colors.border}`, boxShadow: shadow.sm, display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
              <StarRating value={featured.nota} size={16} />
              <p style={{ fontSize: 20, fontWeight: 600, color: colors.gray[900], lineHeight: 1.55, margin: 0, flex: 1 }}>“{featured.texto}”</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 20, borderTop: `1px solid ${colors.border}` }}>
                <Avatar name={featured.nome} src={testimonialPhotos.ana} size={44} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: colors.gray[900], margin: 0 }}>{featured.nome}</p>
                  <p style={{ fontSize: 12, color: colors.gray[500], margin: 0 }}>{featured.pet}</p>
                </div>
              </div>
            </div>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {others.map(o => (
              <Reveal key={o.nome}>
                <div style={{ backgroundColor: colors.white, borderRadius: radius.lg, padding: 24, border: `1px solid ${colors.border}`, display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
                  <StarRating value={o.nota} size={14} />
                  <p style={{ fontSize: 14, color: colors.gray[700], lineHeight: 1.6, margin: 0, flex: 1 }}>“{o.texto}”</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Avatar name={o.nome} src={o.nome === 'Carlos Mendes' ? testimonialPhotos.carlos : testimonialPhotos.juliana} size={32} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: colors.gray[900], margin: 0 }}>{o.nome}</p>
                      <p style={{ fontSize: 11, color: colors.gray[500], margin: 0 }}>{o.pet}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------- TOP AVALIADOS ---------------------------- */

function TopAvaliados() {
  const isMobile = useMediaQuery('(max-width: 1023px)')
  const [topAvaliados, setTopAvaliados] = useState<PrestadorResponseDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    prestadorService.listarTopAvaliados(10)
      .then(data => {
        setTopAvaliados(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section data-anchor style={{ padding: sectionPad(isMobile), backgroundColor: colors.brand[50], borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
      <div style={container}>
        <Reveal>
          <Eyebrow>Destaque</Eyebrow>
          <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 640, color: colors.gray[900], lineHeight: 1.2, marginBottom: 8 }}>
            Top 10 melhores prestadores
          </h2>
          <p style={{ fontSize: 16, color: colors.gray[500], lineHeight: 1.7, margin: 0, maxWidth: 560 }}>
            Os profissionais com as melhores avaliações de tutores que já usaram o Zoop.
          </p>
        </Reveal>

        <Reveal delay={100} style={{ marginTop: 32 }}>
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)', gap: 16 }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} />
              ))}
            </div>
          ) : topAvaliados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: colors.gray[500] }}>
              Nenhum profissional avaliado ainda.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(5, 1fr)', gap: 16 }}>
              {topAvaliados.map((p, idx) => (
                <Link key={p.id} to={`/prestadores/${p.id}`} style={{ textDecoration: 'none', display: 'block', borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.white, border: `1px solid ${colors.border}`, transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease', boxShadow: shadow.sm }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = shadow.md; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.borderColor = colors.brand[300] }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = shadow.sm; (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.borderColor = colors.border }}>
                  {p.bannerUrl && (
                    <div style={{ aspectRatio: '4 / 1', width: '100%', backgroundColor: colors.brand[100], overflow: 'hidden' }}>
                      <img src={`${p.bannerUrl.startsWith('http') ? '' : 'http://localhost:8080'}${p.bannerUrl}`} alt={p.nomePrestador} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }} onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)' }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none' }} />
                    </div>
                  )}
                  <div style={{ padding: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', backgroundColor: colors.brand[100], display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.brand[700], fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{idx + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: colors.gray[900], margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.nomePrestador}</p>
                        <p style={{ fontSize: 11, color: colors.gray[400], margin: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.cidade} - {p.bairro}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <StarRating value={Math.round(p.avaliacaoMedia || 0)} size={12} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: colors.brand[600] }}>{p.avaliacaoMedia?.toFixed(1)}</span>
                      <Badge tone="green">{p.type}</Badge>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Reveal>

        <Reveal delay={200} style={{ marginTop: 24, textAlign: 'center' }}>
          <Link to="/tutor/prestadores" style={{ textDecoration: 'none' }}>
            <Button variant="secondary" size="lg">Ver todos os profissionais</Button>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}

function Skeleton() {
  return (
    <div style={{ borderRadius: radius.xl, overflow: 'hidden', backgroundColor: colors.white, border: `1px solid ${colors.border}`, boxShadow: shadow.sm }}>
      <div style={{ aspectRatio: '4 / 1', background: `linear-gradient(90deg, ${colors.gray[100]} 25%, ${colors.gray[200]} 50%, ${colors.gray[100]} 75%)`, backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.5s infinite' }} />
      <div style={{ padding: 16 }}>
        <div style={{ height: 18, borderRadius: 4, background: `linear-gradient(90deg, ${colors.gray[100]} 25%, ${colors.gray[200]} 50%, ${colors.gray[100]} 75%)`, backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.5s infinite', marginBottom: 8, width: '60%' }} />
        <div style={{ height: 12, borderRadius: 4, background: `linear-gradient(90deg, ${colors.gray[100]} 25%, ${colors.gray[200]} 50%, ${colors.gray[100]} 75%)`, backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.5s infinite', marginBottom: 8, width: '40%' }} />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <div style={{ height: 14, width: 50, borderRadius: 4, background: `linear-gradient(90deg, ${colors.gray[100]} 25%, ${colors.gray[200]} 50%, ${colors.gray[100]} 75%)`, backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.5s infinite' }} />
          <div style={{ height: 14, width: 50, borderRadius: 4, background: `linear-gradient(90deg, ${colors.gray[100]} 25%, ${colors.gray[200]} 50%, ${colors.gray[100]} 75%)`, backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.5s infinite' }} />
          <div style={{ height: 14, width: 80, borderRadius: 4, background: `linear-gradient(90deg, ${colors.gray[100]} 25%, ${colors.gray[200]} 50%, ${colors.gray[100]} 75%)`, backgroundSize: '200% 100%', animation: 'skeleton-shimmer 1.5s infinite' }} />
        </div>
      </div>
    </div>
  )
}

/* ------------------------------- CONFIANÇA ------------------------------- */

function Confianca() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const itens = [
    { icon: <ShieldCheck size={22} />, title: 'Profissionais verificados', desc: 'Perfis com informações reais de cada estabelecimento ou profissional.' },
    { icon: <Star size={22} />, title: 'Avaliações de tutores', desc: 'Notas e comentários de quem já usou o serviço antes de você.' },
    { icon: <MessageCircle size={22} />, title: 'Contato direto', desc: 'Você fala direto com o profissional, sem intermediários.' },
    { icon: <MapPin size={22} />, title: 'Perto de você', desc: 'Busca por localização para encontrar quem está mais próximo.' },
  ]
  return (
    <section data-anchor style={{ padding: sectionPad(isMobile), backgroundColor: colors.white, borderTop: `1px solid ${colors.border}` }}>
      <div style={container}>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr 1fr', gap: isMobile ? 32 : 40 }}>
            {itens.map(item => (
              <div key={item.title}>
                <div style={{ width: 44, height: 44, borderRadius: radius.lg, backgroundColor: colors.brand[100], display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.brand[700], marginBottom: 14 }}>
                  {item.icon}
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: colors.gray[900], marginBottom: 6 }}>{item.title}</p>
                <p style={{ fontSize: 13, color: colors.gray[500], lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* --------------------------------- CTA --------------------------------- */

function CTA() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return (
    <section data-anchor style={{ padding: sectionPad(isMobile), backgroundColor: colors.brand[950] }}>
      <div style={{ ...container, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '0.9fr 1.1fr', gap: isMobile ? 40 : 64, alignItems: 'center' }}>
        <Reveal>
          <div style={{
            borderRadius: radius.xl,
            overflow: 'hidden',
            aspectRatio: isMobile ? '16 / 10' : '4 / 5',
            boxShadow: '0 24px 48px rgba(0,0,0,0.35)',
            border: `1px solid ${colors.brand[800]}`,
          }}>
            <img src={ctaPhoto.src} alt={ctaPhoto.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
        </Reveal>
        <Reveal style={isMobile ? { textAlign: 'center' } : undefined}>
          <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 640, color: colors.white, lineHeight: 1.2, marginBottom: 16 }}>
            Seu pet merece um cuidado de <em style={{ fontStyle: 'italic', fontWeight: 560 }}>confiança</em>
          </h2>
          <p style={{ fontSize: 16, color: colors.brand[200], lineHeight: 1.7, marginBottom: 32 }}>
            Cadastre-se grátis e encontre quem cuida bem, perto de você — em poucos minutos.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: isMobile ? 'center' : 'flex-start', flexWrap: 'wrap', marginBottom: 20 }}>
            <Link to="/cadastro" style={{ textDecoration: 'none' }}>
              <Button size="lg" variant="secondary" style={{ backgroundColor: colors.white, color: colors.brand[900], fontWeight: 700 }}>Cadastrar grátis <ArrowRight size={16} /></Button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button size="lg" variant="secondary" style={{ backgroundColor: 'transparent', color: colors.white, borderColor: colors.brand[700] }}>Já tenho conta</Button>
            </Link>
          </div>
          <p style={{ fontSize: 13, color: colors.brand[400], margin: 0 }}>Sem taxas para tutores • Cadastro em menos de 1 minuto</p>
        </Reveal>
      </div>
    </section>
  )
}

/* -------------------------------- FOOTER -------------------------------- */

function Footer() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return (
    <footer style={{ backgroundColor: colors.brand[950], borderTop: `1px solid ${colors.brand[800]}`, padding: '40px 20px' }}>
      <div style={{ ...container, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', gap: 20 }}>
        <BrandLogo size={24} colorText={colors.white} />
        <p style={{ fontSize: 13, color: colors.gray[500], margin: 0, textAlign: 'center' }}>© 2026 Zoop. Conectando tutores e prestadores de serviços pet.</p>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/login" style={{ fontSize: 13, color: colors.gray[400], textDecoration: 'none' }}>Entrar</Link>
          <Link to="/cadastro" style={{ fontSize: 13, color: colors.gray[400], textDecoration: 'none' }}>Cadastrar</Link>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <Navbar />
      <Hero />
      <Problema />
      <ComoFunciona />
      <Produto />
      <Servicos />
      <TopAvaliados />
      <Avaliacoes />
      <Confianca />
      <CTA />
      <Footer />
    </div>
  )
}
