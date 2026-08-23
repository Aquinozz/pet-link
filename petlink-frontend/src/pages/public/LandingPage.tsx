import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Bath, Building2, Camera, Check, Dog, Heart,
  MapPin, Menu, MessageCircle, PawPrint, Search, ShieldCheck, Star, Stethoscope, Store, X,
} from 'lucide-react'
import { BrandLogo } from '../../components/BrandLogo'
import { Button } from '../../components/ui/Button'
import { StarRating } from '../../components/ui/StarRating'
import { Badge } from '../../components/ui/Badge'
import { Avatar } from '../../components/ui/Avatar'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { colors, radius, shadow } from '../../theme/tokens'
import { useHover } from '../../components/ui/useHover'

const container: React.CSSProperties = { maxWidth: 1120, margin: '0 auto' }
const sectionPad = (isMobile: boolean) => (isMobile ? '64px 20px' : '96px 32px')

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    setMatches(mq.matches)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

function Reveal({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
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
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
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
    <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color, marginBottom: 16 }}>
      {children}
    </p>
  )
}

/* ------------------------------- NAVBAR ------------------------------- */

function NavLink({ href, children }: { href: string; children: string }) {
  const { hovered, ...hoverProps } = useHover()
  return (
    <a
      href={href}
      {...hoverProps}
      style={{ fontSize: 14, fontWeight: 500, color: hovered ? colors.brand[600] : colors.gray[500], textDecoration: 'none' }}
    >
      {children}
    </a>
  )
}

function Navbar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const [open, setOpen] = useState(false)
  const links = [
    { href: '#como-funciona', label: 'Como funciona' },
    { href: '#produto', label: 'O produto' },
    { href: '#servicos', label: 'Serviços' },
    { href: '#depoimentos', label: 'Depoimentos' },
  ]
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: colors.white, borderBottom: `1px solid ${colors.border}` }}>
      <div style={{ ...container, padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <BrandLogo size={28} />
        </Link>

        {!isMobile && (
          <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            {links.map(l => <NavLink key={l.href} href={l.href}>{l.label}</NavLink>)}
          </nav>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {!isMobile && (
            <>
              <Link to="/login" style={{ fontSize: 14, color: colors.gray[700], textDecoration: 'none', fontWeight: 500 }}>Entrar</Link>
              <Link to="/cadastro" style={{ textDecoration: 'none' }}>
                <Button size="sm">Cadastrar grátis</Button>
              </Link>
            </>
          )}
          {isMobile && (
            <button
              onClick={() => setOpen(o => !o)}
              aria-label="Abrir menu"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, border: `1px solid ${colors.border}`, borderRadius: radius.md, background: 'transparent', cursor: 'pointer', color: colors.gray[700] }}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          )}
        </div>
      </div>

      {isMobile && open && (
        <div style={{ borderTop: `1px solid ${colors.border}`, backgroundColor: colors.white, padding: '8px 20px 20px' }}>
          <nav style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }}>
            {links.map(l => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)}
                style={{ padding: '12px 0', borderBottom: `1px solid ${colors.border}`, fontSize: 15, color: colors.gray[700], textDecoration: 'none', fontWeight: 500 }}>
                {l.label}
              </a>
            ))}
          </nav>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link to="/login" style={{ flex: 1, textDecoration: 'none' }}>
              <Button variant="secondary" style={{ width: '100%' }}>Entrar</Button>
            </Link>
            <Link to="/cadastro" style={{ flex: 1, textDecoration: 'none' }}>
              <Button style={{ width: '100%' }}>Cadastrar grátis</Button>
            </Link>
          </div>
        </div>
      )}
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

function Hero() {
  const isMobile = useMediaQuery('(max-width: 1023px)')
  return (
    <section style={{ padding: isMobile ? '96px 0 0' : '128px 0 0', backgroundColor: colors.brand[50] }}>
      <div style={{ ...container, padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.05fr 0.95fr', gap: isMobile ? 48 : 64, alignItems: 'center' }}>
          <div className="landing-fade-up">
            <Eyebrow>Plataforma de serviços pet</Eyebrow>
            <h1 style={{ fontSize: isMobile ? 34 : 46, fontWeight: 800, color: colors.gray[900], lineHeight: 1.12, marginBottom: 20, letterSpacing: '-0.02em' }}>
              Encontre o <span style={{ color: colors.brand[600] }}>profissional certo</span> para cuidar do seu pet
            </h1>
            <p style={{ fontSize: 17, color: colors.gray[500], lineHeight: 1.7, marginBottom: 32, maxWidth: 480 }}>
              Veterinários, pet shops, passeadores e clínicas avaliados por tutores reais, perto de você. Compare perfis e agende direto pelo WhatsApp.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
              <Link to="/cadastro" style={{ textDecoration: 'none' }}>
                <Button size="lg">Cadastrar grátis <ArrowRight size={16} /></Button>
              </Link>
              <a href="#como-funciona" style={{ textDecoration: 'none' }}>
                <Button size="lg" variant="secondary">Ver como funciona</Button>
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: colors.gray[500] }}>
              <Check size={15} color={colors.brand[600]} />
              Cadastro gratuito • sem taxas para tutores
            </div>
          </div>

          <div className="landing-fade-up-delay">
            <Reveal>
              <ScreenFrame title="PetLink">
                <ProvidersMock />
              </ScreenFrame>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
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
            <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: colors.gray[900], lineHeight: 1.2, margin: 0 }}>
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
          <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: colors.gray[900], lineHeight: 1.2, margin: 0 }}>
            Três passos até o cuidado ideal
          </h2>
        </Reveal>
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? 36 : 48 }}>
            {steps.map((s, i) => (
              <div key={s.num} style={{ position: 'relative' }}>
                <p style={{ fontSize: 40, fontWeight: 800, color: colors.brand[100], lineHeight: 1, marginBottom: 12, fontFeatureSettings: '"tnum"' }}>{s.num}</p>
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
          <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: colors.gray[900], lineHeight: 1.2, marginBottom: 12 }}>
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
                  <h3 style={{ fontSize: isMobile ? 22 : 26, fontWeight: 800, color: colors.gray[900], lineHeight: 1.25, marginBottom: 12 }}>{row.title}</h3>
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
            <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: colors.white, lineHeight: 1.2, marginBottom: 16 }}>
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
    texto: 'Encontrei uma veterinária em minutos, com avaliações de verdade. Minha Mel foi tratada com carinho e eu me senti segura o tempo todo.',
  }
  const others = [
    { nome: 'Carlos Mendes', pet: 'Tutor de Rex', nota: 5, texto: 'Agendei o banho do meu dog pelo WhatsApp em dois minutos. Simples assim.' },
    { nome: 'Juliana Lima', pet: 'Tutora de Pepê', nota: 4, texto: 'Muita opção perto de casa e perfis completos. Facilitou muito a escolha.' },
  ]
  return (
    <section id="depoimentos" data-anchor style={{ padding: sectionPad(isMobile), backgroundColor: colors.brand[50] }}>
      <div style={container}>
        <Reveal style={{ maxWidth: 560, marginBottom: 48 }}>
          <Eyebrow>Depoimentos</Eyebrow>
          <h2 style={{ fontSize: isMobile ? 26 : 34, fontWeight: 800, color: colors.gray[900], lineHeight: 1.2, margin: 0 }}>
            Tutores que já confiam no PetLink
          </h2>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.15fr 1fr', gap: 20 }}>
          <Reveal>
            <div style={{ backgroundColor: colors.white, borderRadius: radius.xl, padding: 32, border: `1px solid ${colors.border}`, boxShadow: shadow.sm, display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
              <StarRating value={featured.nota} size={16} />
              <p style={{ fontSize: 20, fontWeight: 600, color: colors.gray[900], lineHeight: 1.55, margin: 0, flex: 1 }}>“{featured.texto}”</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 20, borderTop: `1px solid ${colors.border}` }}>
                <Avatar name={featured.nome} size={44} />
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
                    <Avatar name={o.nome} size={32} />
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
    <section data-anchor style={{ padding: sectionPad(isMobile), backgroundColor: colors.brand[950], textAlign: 'center' }}>
      <div style={{ ...container, maxWidth: 620 }}>
        <Reveal>
          <h2 style={{ fontSize: isMobile ? 28 : 36, fontWeight: 800, color: colors.white, lineHeight: 1.2, marginBottom: 16 }}>
            Seu pet merece um cuidado de confiança
          </h2>
          <p style={{ fontSize: 16, color: colors.brand[200], lineHeight: 1.7, marginBottom: 32 }}>
            Cadastre-se grátis e encontre profissionais perto de você em poucos minutos.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
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
        <p style={{ fontSize: 13, color: colors.gray[500], margin: 0, textAlign: 'center' }}>© 2026 PetLink. Conectando tutores e prestadores de serviços pet.</p>
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
      <Avaliacoes />
      <Confianca />
      <CTA />
      <Footer />
    </div>
  )
}
