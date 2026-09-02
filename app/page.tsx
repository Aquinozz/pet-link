"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Award,
  Bath,
  ChevronRight,
  Dog,
  Heart,
  House,
  MapPin,
  Menu,
  PawPrint,
  Search,
  Star,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const services = [
  { label: "Veterinário", icon: Stethoscope },
  { label: "Banho & Tosa", icon: Bath },
  { label: "Pet sitter", icon: Dog },
  { label: "Hotel para pets", icon: House },
  { label: "Adestramento", icon: Award },
];

const professionals = [
  {
    initials: "MS",
    name: "Dra. Marina Souza",
    role: "Veterinária",
    rating: "4,9 (320)",
    place: "Pituba",
    price: "R$ 120",
  },
  {
    initials: "PB",
    name: "Estética Pet Bella",
    role: "Banho & Tosa",
    rating: "4,8 (184)",
    place: "Itaigara",
    price: "R$ 80",
  },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const router = useRouter();
  const [favorite, setFavorite] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [serviceQuery, setServiceQuery] = useState("");
  const [location, setLocation] = useState("Salvador, BA");
  const [notice, setNotice] = useState("");

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  }

  function submitTopSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const term = search.trim();
    showNotice(term ? `Buscando por “${term}”` : "Digite algo para iniciar a busca.");
  }

  function submitServiceSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (serviceQuery.trim()) params.set("q", serviceQuery.trim());
    if (location.trim()) params.set("local", location.trim());
    router.push(`/servicos?${params.toString()}`);
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="page-width header-main">
          <a className="official-logo" href="#inicio" aria-label="Zoop — página inicial">
            <Image src="/zoop-logo-source.png" alt="Zoop" width={783} height={453} priority />
          </a>

          <form className="top-search" onSubmit={submitTopSearch} role="search">
            <Search aria-hidden="true" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="O que você procura para o seu pet?"
              aria-label="Pesquisar serviços e profissionais"
            />
          </form>

          <div className="header-actions">
            <button type="button" aria-label="Selecionar localização" onClick={() => scrollToSection("encontre-cuidado")}>
              <MapPin />
            </button>
            <button
              type="button"
              aria-label={favorite ? "Remover dos favoritos" : "Abrir favoritos"}
              className={favorite ? "is-active" : ""}
              onClick={() => {
                setFavorite((current) => !current);
                showNotice(favorite ? "Removido dos favoritos." : "Salvo nos favoritos.");
              }}
            >
              <Heart fill={favorite ? "currentColor" : "none"} />
            </button>
            <button type="button" aria-label="Minha conta" onClick={() => router.push("/entrar")}>
              <UserRound />
            </button>
            <button
              type="button"
              className="mobile-menu-button"
              aria-label={mobileMenu ? "Fechar menu" : "Abrir menu"}
              aria-expanded={mobileMenu}
              onClick={() => setMobileMenu((current) => !current)}
            >
              {mobileMenu ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <div className={`page-width nav-row ${mobileMenu ? "is-open" : ""}`}>
          <nav aria-label="Navegação principal">
            <a className="active" href="#inicio" onClick={() => setMobileMenu(false)}>Início</a>
            <a href="/servicos" onClick={() => setMobileMenu(false)}>Serviços</a>
            <a href="/servicos?tipo=clinica" onClick={() => setMobileMenu(false)}>Clínicas</a>
            <a href="/servicos?tipo=profissional" onClick={() => setMobileMenu(false)}>Profissionais</a>
            <a href="#cuidados" onClick={() => setMobileMenu(false)}>Cuidados</a>
          </nav>
          <Button className="login-button" onClick={() => router.push("/entrar")}>Entrar</Button>
        </div>
      </header>

      <main>
        <section className="hero page-width" id="inicio">
          <div className="hero-copy">
            <Badge className="hero-eyebrow">Cuidado completo para o seu pet</Badge>
            <h1>
              Conectando quem <strong>ama</strong>,<br />
              com quem <strong>cuida.</strong>
            </h1>
            <p>Serviços e profissionais para cuidar do seu pet em um só lugar.</p>
            <div className="hero-buttons">
              <Button size="lg" onClick={() => router.push("/servicos")}>Encontrar profissionais</Button>
            </div>
          </div>
        </section>

        <section className="page-width service-shortcuts" id="servicos" aria-labelledby="service-title">
          <h2 className="sr-only" id="service-title">Serviços para seu pet</h2>
          {services.map(({ label, icon: Icon }) => (
            <button key={label} type="button" className="service-card" onClick={() => router.push(`/servicos?q=${encodeURIComponent(label)}`)}>
              <span className="service-icon"><Icon aria-hidden="true" /></span>
              <span>{label}</span>
            </button>
          ))}
        </section>

        <section className="page-width content-grid">
          <aside className="care-finder" id="encontre-cuidado" aria-labelledby="finder-title">
            <div className="finder-heading">
              <span className="finder-icon"><PawPrint /></span>
              <div>
                <span>Rede Zoop</span>
                <h2 id="finder-title">Encontre cuidado perto de você</h2>
              </div>
            </div>

            <form onSubmit={submitServiceSearch}>
              <label>
                <span>Serviço</span>
                <div className="finder-input"><Search /><Input value={serviceQuery} onChange={(event) => setServiceQuery(event.target.value)} placeholder="Serviço ou especialidade" /></div>
              </label>
              <label>
                <span>Localização</span>
                <div className="finder-input"><MapPin /><Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Cidade ou bairro" /></div>
              </label>
              <Button type="submit">Buscar</Button>
            </form>

            <div className="professional-list">
              {professionals.map((professional) => (
                <article className="professional-card" key={professional.name}>
                  <div className="professional-avatar" aria-hidden="true">{professional.initials}</div>
                  <div className="professional-main">
                    <h3>{professional.name}</h3>
                    <p>{professional.role}</p>
                    <span><Star fill="currentColor" /> {professional.rating} <b>•</b> {professional.place}</span>
                  </div>
                  <div className="professional-meta">
                    <Badge>Disponível hoje</Badge>
                    <small>a partir de</small>
                    <strong>{professional.price}</strong>
                  </div>
                </article>
              ))}
            </div>
          </aside>
        </section>

        <section className="care-message page-width" id="cuidados">
          <Image src="/zoop-symbol-source.png" alt="Símbolo Zoop com cachorro e gato" width={375} height={404} />
          <div>
            <span className="section-kicker">Quem ama, cuida</span>
            <h2>Uma rede de confiança para cada fase da vida do seu pet.</h2>
            <p>Descubra profissionais, serviços e conteúdos selecionados para tornar o cuidado mais simples e seguro.</p>
          </div>
          <Button variant="outline" onClick={() => showNotice("Conteúdos de cuidado em breve.")}>Conhecer a Zoop <ChevronRight /></Button>
        </section>
      </main>

      <footer>
        <div className="page-width footer-content">
          <div>
            <strong>Zoop</strong>
            <p>Conectando quem ama, com quem cuida.</p>
          </div>
          <p>Projeto acadêmico · Salvador, Bahia</p>
        </div>
      </footer>

      {notice && <div className="action-notice" role="status" aria-live="polite">{notice}</div>}
    </div>
  );
}
