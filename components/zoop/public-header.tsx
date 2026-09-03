"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MapPin, Menu, Search, UserRound, X } from "lucide-react";

import { ZoopLogo } from "./brand";
import { useAuth } from "@/lib/auth";

export function PublicHeader({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState(false);
  const dashboardPath = user?.role === "ROLE_PROFISSIONAL" ? "/profissional" : "/tutor";

  function search(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/servicos${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  }

  return (
    <header className={`zoop-public-header ${compact ? "zoop-public-header--compact" : ""}`}>
      <div className="zoop-public-header__main">
        <ZoopLogo compact />
        <form className="zoop-app-search" onSubmit={search} role="search">
          <Search />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="O que você procura para o seu pet?" aria-label="Pesquisar na Zoop" />
        </form>
        <div className="zoop-public-actions">
          <Link href="/servicos" aria-label="Localização"><MapPin /></Link>
          <Link href="/servicos?favoritos=1" aria-label="Favoritos"><Heart /></Link>
          <Link href={isAuthenticated ? dashboardPath : "/entrar"} aria-label="Minha conta"><UserRound /></Link>
          <button className="zoop-mobile-toggle" type="button" onClick={() => setMenu((value) => !value)} aria-label={menu ? "Fechar menu" : "Abrir menu"}>{menu ? <X /> : <Menu />}</button>
        </div>
      </div>
      <div className={`zoop-public-nav ${menu ? "is-open" : ""}`}>
        <nav aria-label="Navegação principal">
          <Link href="/">Início</Link>
          <Link href="/servicos">Serviços</Link>
          <Link href="/servicos?tipo=clinica">Clínicas</Link>
          <Link href="/servicos?tipo=profissional">Profissionais</Link>
          <Link href="/#cuidados">Cuidados</Link>
        </nav>
        <Link className="zoop-primary-button zoop-primary-button--small" href={isAuthenticated ? dashboardPath : "/entrar"}>
          {isAuthenticated ? "Minha conta" : "Entrar"}
        </Link>
      </div>
    </header>
  );
}

