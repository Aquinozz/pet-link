"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Award, Bath, ChevronDown, Dog, Home, MapPin, Search, SlidersHorizontal, Star, Stethoscope } from "lucide-react";

import { PublicHeader } from "@/components/zoop/public-header";
import { PersonAvatar, StatusPill } from "@/components/zoop/ui";
import { prestadorService } from "@/lib/services";
import type { PrestadorResponseDto, TipoPrestador } from "@/lib/types";

const categories = [
  { label: "Todos os serviços", icon: SlidersHorizontal },
  { label: "Veterinário", icon: Stethoscope },
  { label: "Banho e Tosa", icon: Bath },
  { label: "Pet sitter", icon: Dog },
  { label: "Hospedagem", icon: Home },
  { label: "Adestramento", icon: Award },
];

const typeLabels: Record<TipoPrestador, string> = {
  CLINICA_VETERINARIA: "Clínica veterinária",
  VETERINARIO: "Médico-veterinário",
  PETSHOP: "Pet Shop",
  PASSEADOR: "Passeador",
  CRECHE_PET: "Hospedagem",
  BANHO_E_TOSA: "Banho e Tosa",
  PET_SITTER: "Pet sitter",
};

const tones = ["teal", "rose", "gold", "green"] as const;

function initialsOf(name: string) {
  return name
    .replace(/^(Dr\.|Dra\.)\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function realRating(value?: number) {
  if (value == null || value <= 0) return "Novo";
  return value.toFixed(1).replace(".", ",");
}

function placeOf(item: PrestadorResponseDto) {
  return [item.bairro, item.cidade].filter(Boolean).join(" · ") || "Salvador, BA";
}

export default function ServicesPage() {
  const [results, setResults] = useState<Array<{
    id: number;
    name: string;
    initials: string;
    role: string;
    rating: string;
    place: string;
    price: string;
    specialties: string[];
    tone: (typeof tones)[number];
    href: string;
  }>>([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Salvador, BA");
  const [category, setCategory] = useState("Todos os serviços");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    prestadorService
      .listar()
      .then((list) =>
        setResults(
          list.map((item, index) => ({
            id: item.id,
            name: item.nomePrestador,
            initials: initialsOf(item.nomePrestador),
            role: typeLabels[item.type] ?? item.type,
            rating: realRating(item.avaliacaoMedia),
            place: placeOf(item),
            price: item.horarioFuncionamento ?? "Consulte disponibilidade",
            specialties: (item.servicos ?? "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
            tone: tones[index % tones.length],
            href: `/profissionais/armando?id=${item.id}`,
          }))
        )
      )
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => results.filter((item) => {
    const search = `${item.name} ${item.role} ${item.specialties.join(" ")} ${item.place}`.toLowerCase();
    const queryMatch = search.includes(query.toLowerCase());
    const categoryMatch =
      category === "Todos os serviços" ||
      (category === "Veterinário"
        ? item.role.toLowerCase().includes("veterin")
        : category === "Banho e Tosa"
        ? item.role.toLowerCase().includes("banho")
        : category === "Pet sitter"
        ? item.role.toLowerCase().includes("sitter")
        : category === "Hospedagem"
        ? item.role.toLowerCase().includes("hospedagem") ||
          item.role.toLowerCase().includes("creche")
        : item.role.toLowerCase().includes(category.toLowerCase()));
    const ratingMatch = Number(item.rating.replace(",", ".").replace("Novo", "0")) >= rating;
    return queryMatch && categoryMatch && ratingMatch;
  }), [category, query, rating, results]);

  return (
    <div className="zoop-public-page">
      <PublicHeader />
      <main className="zoop-discovery zoop-stagger">
        <header className="zoop-discovery__intro zoop-reveal"><div><span className="zoop-eyebrow">Rede verificada</span><h1>Encontre o cuidado <strong>ideal</strong></h1><p>Serviços confiáveis perto de você.</p></div><form onSubmit={(event) => event.preventDefault()}><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Serviço ou especialidade" /></label><label><MapPin /><input value={location} onChange={(event) => setLocation(event.target.value)} /></label><button className="zoop-primary-button" type="submit">Buscar</button></form></header>

        <div className="zoop-category-row zoop-reveal">{categories.map(({ label, icon: Icon }) => <button className={category === label ? "is-active" : ""} type="button" onClick={() => setCategory(label)} key={label}><Icon />{label}</button>)}</div>

        <div className="zoop-discovery-layout">
          <aside className="zoop-panel zoop-discovery-filters zoop-reveal">
            <div className="zoop-panel__heading"><h2>Filtros</h2><SlidersHorizontal /></div>
            <fieldset><legend>Tipo de serviço</legend>{categories.slice(1).map(({ label }) => <label key={label}><input type="checkbox" checked={category === label} onChange={() => setCategory(category === label ? "Todos os serviços" : label)} />{label}</label>)}</fieldset>
            <fieldset><legend>Bairro</legend>{["Pituba", "Itaigara", "Rio Vermelho", "Graça"].map((place) => <label key={place}><input type="checkbox" />{place}</label>)}</fieldset>
            <fieldset><legend>Avaliação</legend>{[4, 4.5, 4.8].map((value) => <button className={rating === value ? "is-active" : ""} type="button" onClick={() => setRating(rating === value ? 0 : value)} key={value}><Star fill="currentColor" /> {String(value).replace(".", ",")} ou mais</button>)}</fieldset>
            <button className="zoop-text-button" type="button" onClick={() => { setCategory("Todos os serviços"); setRating(0); setQuery(""); }}>Limpar filtros</button>
          </aside>

          <section className="zoop-discovery-results zoop-reveal">
            <div className="zoop-map-card" aria-label="Mapa ilustrativo de Salvador com profissionais próximos">
              <div className="zoop-map-lines" aria-hidden="true" />
              {["18% 65%", "41% 43%", "62% 30%", "78% 55%"].map((position, index) => { const [left, top] = position.split(" "); return <span className="zoop-map-pin" style={{ left, top }} key={position}><MapPin /><i>{index + 1}</i></span>; })}
              <div><MapPin /><span>Buscando em<strong>{location}</strong></span></div>
            </div>
            <div className="zoop-results-heading"><h2>{loading ? "Carregando profissionais..." : `${visible.length} resultados encontrados`}</h2><button type="button">Mais relevantes <ChevronDown /></button></div>
            {visible.length === 0 && !loading && (
              <div className="zoop-panel zoop-empty-state zoop-reveal"><h3>Nenhum profissional encontrado</h3><p>Tente outro termo de busca ou limpe os filtros.</p></div>
            )}
            {visible.map((item) => (
              <article className="zoop-panel zoop-result-card" key={item.id}>
                <PersonAvatar initials={item.initials} name={item.name} tone={item.tone} size="lg" />
                <div className="zoop-result-card__main"><h3>{item.name}</h3><p>{item.role}</p><span><Star fill="currentColor" /> {item.rating} <b>•</b> <MapPin /> {item.place}</span><StatusPill>Disponível hoje</StatusPill></div>
                <div className="zoop-specialty-list">{item.specialties.slice(0, 4).map((specialty) => <span key={specialty}>{specialty}</span>)}</div>
                <div className="zoop-result-card__schedule"><small>Horário de atendimento</small><strong>{item.price}</strong></div>
                <div className="zoop-result-card__price"><small>Profissional Zoop</small><strong>Avaliação {item.rating}</strong><Link className="zoop-primary-button" href={item.href}>Ver perfil</Link></div>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}