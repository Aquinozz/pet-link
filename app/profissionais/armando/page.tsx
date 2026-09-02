"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, ChevronLeft, ChevronRight, MapPin, ShieldCheck, Star, Stethoscope, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { PublicHeader } from "@/components/zoop/public-header";
import { PersonAvatar, PetAvatar, StatusPill, SuccessMark } from "@/components/zoop/ui";
import { agendamentoService, petService, prestadorService } from "@/lib/services";
import { useAuth } from "@/lib/auth";
import type { PetResponseDto, PrestadorResponseDto } from "@/lib/types";

const reviewItems = [
  { name: "Juliana P.", initials: "JP", text: "Atendimento excelente e muito cuidadoso." },
  { name: "Ricardo M.", initials: "RM", text: "Explicou cada etapa e deixou o Thor tranquilo." },
  { name: "Fernanda L.", initials: "FL", text: "Profissional pontual, atencioso e seguro." },
];

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

function typeLabel(type?: string) {
  return {
    CLINICA_VETERINARIA: "Clínica veterinária",
    VETERINARIO: "Médico-veterinário",
    PETSHOP: "Pet Shop",
    PASSEADOR: "Passeador",
    CRECHE_PET: "Hospedagem",
    BANHO_E_TOSA: "Banho e Tosa",
    PET_SITTER: "Pet sitter",
  }[type ?? ""] ?? "Profissional";
}

export default function ProfessionalProfilePage() {
  const router = useRouter();
  const { isAuthenticated, tutorId } = useAuth();
  const [prestador, setPrestador] = useState<PrestadorResponseDto | null>(null);
  const [pets, setPets] = useState<PetResponseDto[]>([]);
  const [petId, setPetId] = useState<number | null>(null);
  const [servico, setServico] = useState("Consulta veterinária");
  const [day, setDay] = useState(17);
  const [time, setTime] = useState("14:00");
  const [confirmed, setConfirmed] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));
    const load = id
      ? prestadorService.buscarPorId(id)
      : prestadorService.listar().then((list) => list[0]);
    load
      .then((found) => {
        setPrestador(found);
        setServico(
          (found.servicos ?? "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)[0] ?? "Consulta veterinária"
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      petService
        .listar()
        .then((list) => {
          setPets(list);
          if (list.length) setPetId(list[0].id);
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const year = new Date().getFullYear();

  async function confirmBooking() {
    setBookingError("");
    if (!isAuthenticated) {
      router.push("/entrar");
      return;
    }
    if (!prestador || !petId || !tutorId) {
      setBookingError("Você precisa ter um pet cadastrado para agendar.");
      return;
    }
    setSaving(true);
    const dataHora = `${String(day).padStart(2, "0")}/09/${year} ${time}:00`;
    try {
      await agendamentoService.criar({
        tutorId,
        petId,
        prestadorId: prestador.id,
        dataHora,
        servico,
      });
      setConfirmed(true);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setBookingError(message ?? "Não foi possível confirmar o agendamento.");
    } finally {
      setSaving(false);
    }
  }

  const displayName = prestador?.nomePrestador ?? "Dr. Armando Silva";
  const initials = useMemo(() => (prestador ? initialsOf(displayName) : "AS"), [displayName, prestador]);
  const rating = prestador?.avaliacaoMedia != null && prestador.avaliacaoMedia > 0
    ? prestador.avaliacaoMedia.toFixed(1).replace(".", ",")
    : "—";
  const tags = (prestador?.servicos ?? "Clínica geral,Dermatologia,Vacinação")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="zoop-public-page">
      <PublicHeader />
      <main className="zoop-profile-page zoop-stagger">
        <div className="zoop-breadcrumb zoop-reveal"><Link href="/servicos">Profissionais</Link><ChevronRight /><span>{displayName}</span></div>
        <div className="zoop-profile-layout">
          <section className="zoop-profile-main">
            <article className="zoop-panel zoop-professional-hero zoop-reveal">
              <div className="zoop-doctor-portrait"><PersonAvatar initials={initials} name={displayName} tone="teal" size="lg" /><Stethoscope /></div>
              <div><span className="zoop-eyebrow">Perfil profissional</span><h1>{displayName}</h1><h2>{prestador ? typeLabel(prestador.type) : "Médico-veterinário"}</h2>{tags[0] && <strong>{tags[0]}</strong>}<StatusPill><ShieldCheck /> Profissional verificado</StatusPill><p className="zoop-profile-rating"><Star fill="currentColor" /> <b>{rating}</b> avaliação média</p><p><MapPin /> {[prestador?.cidade].filter(Boolean).join(", ") || "Salvador, BA"}</p><hr /><h3>Sobre o profissional</h3><p>{loading ? "Carregando perfil..." : prestador?.descricao ?? "Profissional da rede Zoop, pronto para cuidar do seu pet."}</p><div className="zoop-profile-tags">{tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
            </article>

            <section className="zoop-panel zoop-profile-reviews zoop-reveal">
              <div className="zoop-profile-review-summary"><strong>{rating}</strong><span className="zoop-stars">★★★★★</span><small>avaliação média</small><Link href="#avaliacoes">Ver todas as avaliações <ArrowRight /></Link></div>
              <div className="zoop-profile-review-cards" id="avaliacoes">{reviewItems.map((review, index) => <article key={review.name}><PersonAvatar initials={review.initials} name={review.name} tone={index % 2 ? "gold" : "rose"} /><div><strong>{review.name}</strong><span className="zoop-stars">★★★★★</span><p>{review.text}</p></div></article>)}</div>
            </section>
          </section>

          <aside className="zoop-panel zoop-booking-card zoop-reveal">
            <div className="zoop-panel__heading"><h2>Agendar atendimento</h2><CalendarDays /></div>
            <label><span>Serviço</span><select value={servico} onChange={(event) => setServico(event.target.value)}>{tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}</select></label>
            <div className="zoop-booking-calendar">
              <div><button type="button" aria-label="Mês anterior"><ChevronLeft /></button><strong>Setembro</strong><button type="button" aria-label="Próximo mês"><ChevronRight /></button></div>
              <div className="zoop-calendar__week"><span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span></div>
              <div>{Array.from({ length: 30 }, (_, index) => index + 1).map((value) => <button className={day === value ? "is-selected" : [3, 10, 17, 24].includes(value) ? "is-available" : ""} type="button" onClick={() => setDay(value)} key={value}>{value}</button>)}</div>
            </div>
            <fieldset><legend>Horários disponíveis</legend><div className="zoop-time-grid">{["14:00", "14:30", "15:30"].map((value) => <button className={time === value ? "is-selected" : ""} type="button" onClick={() => setTime(value)} key={value}>{value}</button>)}</div></fieldset>
            <label><span>Para qual pet?</span>{pets.length ? <select className="zoop-pet-selector" value={petId ?? ""} onChange={(event) => setPetId(Number(event.target.value))}>{pets.map((pet) => <option key={pet.id} value={pet.id}>{pet.nome}</option>)}</select> : <button className="zoop-pet-selector" type="button" onClick={() => router.push(isAuthenticated ? "/tutor/pets" : "/entrar")}><PetAvatar size="sm" /> {isAuthenticated ? "Nenhum pet cadastrado" : "Entrar para escolher o pet"} <ChevronRight /></button>}</label>
            {bookingError && <p className="zoop-auth-error">{bookingError}</p>}
            <div className="zoop-booking-total"><span>Total</span><strong>{prestador?.horarioFuncionamento ?? "Consulte disponibilidade"}</strong></div>
            <button className="zoop-primary-button" type="button" disabled={saving} onClick={confirmBooking}>{saving ? "Confirmando..." : "Confirmar agendamento"} <ArrowRight /></button>
            <small><ShieldCheck /> Agendamento seguro e cancelamento gratuito até 24h antes.</small>
          </aside>
        </div>
      </main>

      {confirmed && <div className="zoop-modal-layer" role="presentation" onMouseDown={() => setConfirmed(false)}><div className="zoop-modal zoop-success-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><button className="zoop-modal__close" type="button" onClick={() => setConfirmed(false)}><X /></button><SuccessMark label="Agendamento confirmado" /><span className="zoop-eyebrow">Tudo certo!</span><h2>Agendamento confirmado</h2><p>{servico} com {displayName} no dia {day} de setembro, às {time}.</p><div><PetAvatar size="md" /><span><strong>{pets.find((pet) => pet.id === petId)?.nome}</strong><small>Você receberá um lembrete 24 horas antes.</small></span></div><Link className="zoop-primary-button" href="/tutor/agendamentos"><Check /> Ver meus agendamentos</Link></div></div>}
    </div>
  );
}