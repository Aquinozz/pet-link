"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  Heart,
  History,
  Home,
  LogOut,
  Menu,
  PawPrint,
  Search,
  Settings,
  Star,
  Stethoscope,
  Users,
  X,
} from "lucide-react";

import { ZoopLogo } from "./brand";
import { PersonAvatar } from "./ui";
import { useAuth } from "@/lib/auth";

type Role = "tutor" | "professional";

const NoticeContext = createContext<(message: string) => void>(() => undefined);

export function useZoopNotice() {
  return useContext(NoticeContext);
}

const tutorNav = [
  { href: "/tutor", label: "Início", icon: Home },
  { href: "/tutor/pets", label: "Meus pets", icon: PawPrint },
  { href: "/tutor/agendamentos", label: "Agendamentos", icon: CalendarDays },
  { href: "/servicos", label: "Explorar serviços", icon: Heart },
  { href: "/tutor/historico", label: "Histórico", icon: History },
];

const professionalNav = [
  { href: "/profissional", label: "Painel", icon: Home },
  { href: "/profissional/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/profissional/clientes", label: "Clientes e pets", icon: Users },
  { href: "/profissional/servicos", label: "Serviços", icon: ClipboardList },
  { href: "/profissional/avaliacoes", label: "Avaliações", icon: Star },
];

export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isHydrated, nome, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState(3);
  const nav = role === "tutor" ? tutorNav : professionalNav;

  useEffect(() => {
    if (isHydrated && !isAuthenticated) router.replace("/entrar");
  }, [isHydrated, isAuthenticated, router]);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  }

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!search.trim()) {
      showNotice("Digite um nome, serviço ou especialidade.");
      return;
    }
    router.push(`/servicos?q=${encodeURIComponent(search.trim())}`);
  }

  const identity = useMemo(
    () => {
      const fallback = role === "tutor"
        ? { name: "Mariana Almeida", subtitle: "Tutora", initials: "MA", tone: "rose" as const }
        : { name: "Dr. Armando Silva", subtitle: "Veterinário", initials: "AS", tone: "teal" as const };
      const realName = nome ?? fallback.name;
      const initials = realName
        .replace(/^(Dr\.|Dra\.)\s+/i, "")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
      return { ...fallback, name: realName, initials: initials || fallback.initials };
    },
    [nome, role],
  );

  if (!isHydrated || !isAuthenticated) {
    return (
      <div className="zoop-dashboard-loading" role="status" aria-live="polite">
        <span className="zoop-dashboard-loading__spinner" aria-hidden="true" />
        Carregando...
      </div>
    );
  }

  return (
    <NoticeContext.Provider value={showNotice}>
      <div className="zoop-dashboard is-mounted">
        <div className="zoop-dashboard__aurora" aria-hidden="true" />
        <header className="zoop-app-header">
          <ZoopLogo compact />
          <form className="zoop-app-search" onSubmit={submitSearch} role="search">
            <Search />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="O que você procura para o seu pet?" aria-label="Pesquisar na Zoop" />
            <kbd>⌘ K</kbd>
          </form>
          <div className="zoop-app-account">
            <button
              className="zoop-icon-button zoop-notification-button"
              type="button"
              aria-label="Abrir notificações"
              onClick={() => {
                setNotifications(0);
                showNotice("Você está em dia com suas notificações.");
              }}
            >
              <Bell />
              {notifications > 0 && <span>{notifications}</span>}
            </button>
            <div className="zoop-account-menu-wrap">
              <button
                className="zoop-account-copy"
                type="button"
                aria-haspopup="menu"
                aria-expanded={accountMenuOpen}
                onClick={() => setAccountMenuOpen((value) => !value)}
              >
                <PersonAvatar initials={identity.initials} name={identity.name} tone={identity.tone} />
                <span><strong>{identity.name}</strong><small>{identity.subtitle}</small></span>
                <ChevronDown />
              </button>
              {accountMenuOpen && (
                <>
                  <button className="zoop-account-menu-backdrop" type="button" aria-label="Fechar menu" onClick={() => setAccountMenuOpen(false)} />
                  <div className="zoop-account-menu" role="menu">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        showNotice("As configurações serão abertas em breve.");
                      }}
                    >
                      <Settings /><span>Configurações</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        signOut();
                        router.replace("/entrar");
                      }}
                    >
                      <LogOut /><span>Sair da conta</span>
                    </button>
                  </div>
                </>
              )}
            </div>
            <button className="zoop-mobile-toggle" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </header>

        <aside className={`zoop-sidebar ${menuOpen ? "is-open" : ""}`}>
          <nav aria-label={role === "tutor" ? "Área do tutor" : "Área profissional"}>
            {nav.map(({ href, label, icon: Icon }) => {
              const exact = href === "/tutor" || href === "/profissional";
              const active = exact ? pathname === href : pathname.startsWith(href);
              return (
                <Link className={active ? "is-active" : ""} href={href} key={href} onClick={() => setMenuOpen(false)}>
                  <Icon />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="zoop-sidebar__divider" />
          <button type="button" onClick={() => showNotice("As configurações serão abertas em breve.")}>
            <Settings /><span>Configurações</span>
          </button>
          <button type="button" onClick={() => { signOut(); router.replace("/entrar"); }}>
            <LogOut /><span>Sair da conta</span>
          </button>
          <div className="zoop-sidebar__help">
            <Stethoscope />
            <div><strong>Precisa de ajuda?</strong><small>Fale com o suporte Zoop</small></div>
          </div>
        </aside>

        {menuOpen && <button className="zoop-sidebar-backdrop" type="button" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}
        <main className="zoop-app-main">{children}</main>
        {notice && <div className="zoop-toast" role="status" aria-live="polite"><PawPrint />{notice}</div>}
      </div>
    </NoticeContext.Provider>
  );
}
