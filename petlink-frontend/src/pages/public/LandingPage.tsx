import { Link } from 'react-router-dom'
import {
  Stethoscope, Store, Dog, Building2, Heart,
  ShieldCheck, Star, ArrowRight, CheckCircle2
} from 'lucide-react'

function Navbar() {
  return (
    <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, backgroundColor: '#fff', borderBottom: '1px solid #e5e7eb' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>P</span>
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
            Pet<span style={{ color: '#2563EB' }}>Link</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <a href="#como-funciona" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>Como funciona</a>
          <a href="#servicos" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>Serviços</a>
          <a href="#avaliacoes" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none', fontWeight: 500 }}>Avaliações</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link to="/login" style={{ fontSize: 14, color: '#374151', textDecoration: 'none', fontWeight: 500 }}>Entrar</Link>
          <Link to="/cadastro" style={{ fontSize: 14, backgroundColor: '#2563EB', color: '#fff', padding: '10px 20px', borderRadius: 8, fontWeight: 600, textDecoration: 'none' }}>
            Cadastre-se grátis
          </Link>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section style={{ paddingTop: 120, paddingBottom: 80, paddingLeft: 48, paddingRight: 48, background: 'linear-gradient(135deg, #eff6ff 0%, #f8fafc 60%, #fdf2f8 100%)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
        {/* Texto */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#dbeafe', color: '#1d4ed8', fontSize: 13, fontWeight: 600, padding: '6px 14px', borderRadius: 100, marginBottom: 24 }}>
            <Heart size={13} fill="#1d4ed8" />
            Plataforma pet de confiança
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 800, color: '#111827', lineHeight: 1.15, marginBottom: 20 }}>
            Cuide do seu pet<br />
            com <span style={{ color: '#2563EB' }}>quem entende</span>
          </h1>

          <p style={{ fontSize: 18, color: '#6b7280', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
            Conectamos tutores a veterinários, pet shops, passeadores e clínicas de forma simples. Encontre, agende e avalie — tudo em um só lugar.
          </p>

          <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
            <Link to="/cadastro" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#2563EB', color: '#fff', padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>
              Cadastre-se grátis <ArrowRight size={18} />
            </Link>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#fff', color: '#374151', padding: '14px 28px', borderRadius: 12, fontWeight: 600, fontSize: 16, textDecoration: 'none', border: '1.5px solid #e5e7eb' }}>
              Já tenho conta
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 24 }}>
            {['Cadastro gratuito', 'Via WhatsApp', 'Prestadores verificados'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#6b7280' }}>
                <CheckCircle2 size={15} color="#22c55e" />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Card visual */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ backgroundColor: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #f3f4f6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Stethoscope size={24} color="#2563EB" />
              </div>
              <div>
                <p style={{ fontWeight: 700, fontSize: 15, color: '#111827', margin: 0 }}>Dr. Carlos Mendes</p>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Veterinário • São Paulo, SP</p>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#facc15" color="#facc15" />)}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ fontSize: 12, backgroundColor: '#eff6ff', color: '#2563EB', padding: '4px 10px', borderRadius: 6, fontWeight: 500 }}>Consultas</span>
              <span style={{ fontSize: 12, backgroundColor: '#f0fdf4', color: '#16a34a', padding: '4px 10px', borderRadius: 6, fontWeight: 500 }}>Disponível hoje</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ backgroundColor: '#2563EB', borderRadius: 16, padding: 20, color: '#fff' }}>
              <p style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>+500</p>
              <p style={{ fontSize: 13, opacity: 0.8, margin: '4px 0 0' }}>tutores cadastrados</p>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, border: '1px solid #f3f4f6', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: 32, fontWeight: 800, margin: 0, color: '#111827' }}>+120</p>
              <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>prestadores verificados</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ComoFunciona() {
  const steps = [
    { num: '01', title: 'Cadastre-se', desc: 'Crie sua conta em segundos e adicione seus pets com nome, espécie e raça.' },
    { num: '02', title: 'Encontre prestadores', desc: 'Navegue por veterinários, pet shops e passeadores com avaliações reais.' },
    { num: '03', title: 'Agende pelo WhatsApp', desc: 'Entre em contato direto com o prestador e confirme o horário na hora.' },
  ]
  return (
    <section id="como-funciona" style={{ padding: '96px 48px', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: '#111827', marginBottom: 12 }}>Como funciona</h2>
          <p style={{ fontSize: 17, color: '#6b7280' }}>Três passos simples para cuidar melhor do seu pet</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32 }}>
          {steps.map((step, i) => (
            <div key={step.num} style={{ backgroundColor: '#f8fafc', borderRadius: 20, padding: 32, position: 'relative' }}>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#dbeafe', marginBottom: 16, lineHeight: 1 }}>{step.num}</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 10 }}>{step.title}</h3>
              <p style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              {i < 2 && (
                <div style={{ position: 'absolute', right: -16, top: '50%', transform: 'translateY(-50%)', color: '#2563EB', zIndex: 1 }}>
                  <ArrowRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Servicos() {
  const servicos = [
    { icon: <Stethoscope size={28} color="#2563EB" />, label: 'Veterinário', bg: '#eff6ff' },
    { icon: <Store size={28} color="#ec4899" />, label: 'Pet Shop', bg: '#fdf2f8' },
    { icon: <Dog size={28} color="#d97706" />, label: 'Passeador', bg: '#fffbeb' },
    { icon: <Building2 size={28} color="#2563EB" />, label: 'Clínica Veterinária', bg: '#eff6ff' },
    { icon: <Heart size={28} color="#ec4899" />, label: 'Creche Pet', bg: '#fdf2f8' },
    { icon: <ShieldCheck size={28} color="#16a34a" />, label: 'Banho e Tosa', bg: '#f0fdf4' },
  ]
  return (
    <section id="servicos" style={{ padding: '96px 48px', backgroundColor: '#f8fafc' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: '#111827', marginBottom: 12 }}>Serviços disponíveis</h2>
          <p style={{ fontSize: 17, color: '#6b7280' }}>Encontre o profissional certo para cada necessidade do seu pet</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 20 }}>
          {servicos.map(s => (
            <Link to="/login" key={s.label} style={{ textDecoration: 'none', backgroundColor: '#fff', borderRadius: 16, padding: '24px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, border: '1px solid #f3f4f6', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#bfdbfe', e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#f3f4f6', e.currentTarget.style.boxShadow = 'none')}>
              <div style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.icon}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.3 }}>{s.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function Avaliacoes() {
  const depoimentos = [
    { nome: 'Ana Souza', pet: 'Tutora de gatos', nota: 5, texto: 'Encontrei um ótimo veterinário em minutos. Processo super simples e o profissional foi incrível com minha Mel.', inicial: 'A', cor: '#2563EB' },
    { nome: 'Carlos Mendes', pet: 'Tutor de cão', nota: 5, texto: 'Agendei o banho do meu dog em 2 minutos pelo WhatsApp. Recomendo demais para quem quer praticidade.', inicial: 'C', cor: '#ec4899' },
    { nome: 'Juliana Lima', pet: 'Tutora de coelho', nota: 4, texto: 'Não sabia que existia tanta opção perto de casa. A plataforma facilita muito na hora de escolher o profissional.', inicial: 'J', cor: '#d97706' },
  ]
  return (
    <section id="avaliacoes" style={{ padding: '96px 48px', backgroundColor: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 40, fontWeight: 800, color: '#111827', marginBottom: 12 }}>O que dizem os tutores</h2>
          <p style={{ fontSize: 17, color: '#6b7280' }}>Avaliações reais de quem usa o PetLink</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 28 }}>
          {depoimentos.map(d => (
            <div key={d.nome} style={{ backgroundColor: '#f8fafc', borderRadius: 20, padding: 28, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: d.nota }).map((_, i) => <Star key={i} size={16} fill="#facc15" color="#facc15" />)}
              </div>
              <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, margin: 0, flex: 1 }}>"{d.texto}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: d.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                  {d.inicial}
                </div>
                <div>
                  <p style={{ fontWeight: 700, fontSize: 14, color: '#111827', margin: 0 }}>{d.nome}</p>
                  <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{d.pet}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section style={{ padding: '96px 48px', backgroundColor: '#2563EB' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
          Pronto para cuidar melhor do seu pet?
        </h2>
        <p style={{ fontSize: 17, color: '#bfdbfe', marginBottom: 36 }}>
          Crie sua conta gratuita e encontre os melhores profissionais perto de você.
        </p>
        <Link to="/cadastro" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, backgroundColor: '#fff', color: '#2563EB', padding: '16px 36px', borderRadius: 12, fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>
          Começar agora <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ backgroundColor: '#111827', padding: '40px 48px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>P</span>
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>PetLink</span>
        </div>
        <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>© 2026 PetLink. Conectando tutores e prestadores de serviços pet.</p>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link to="/login" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>Entrar</Link>
          <Link to="/cadastro" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>Cadastrar</Link>
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
      <ComoFunciona />
      <Servicos />
      <Avaliacoes />
      <CTA />
      <Footer />
    </div>
  )
}
