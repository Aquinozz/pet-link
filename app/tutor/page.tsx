"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bath,
  BellRing,
  CalendarDays,
  ChevronRight,
  Dog,
  HeartHandshake,
  Home,
  MapPin,
  PawPrint,
  Star,
  Stethoscope,
  Syringe,
} from "lucide-react";

import { useZoopNotice } from "@/components/zoop/app-shell";
import { useAuth } from "@/lib/auth";
import { IconBadge, PageIntro, PersonAvatar, PetAvatar, StatusPill, TiltCard } from "@/components/zoop/ui";
import { agendamentoService, petService, prestadorService } from "@/lib/services";
import type { AgendamentoResponseDto, PetResponseDto, PrestadorResponseDto } from "@/lib/types";

const quickServices = [
  { label: "Veterinário", icon: Stethoscope, query: "veterinario" },
  { label: "Banho e Tosa", icon: Bath, query: "banho-e-tosa" },
  { label: "Pet sitter", icon: Dog, query: "pet-sitter" },
  { label: "Hospedagem", icon: Home, query: "hospedagem" },
];

const tones = ["teal", "gold", "rose", "green"] as const;

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

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" }) +
    ", " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export default function TutorDashboard() {
  const notice = useZoopNotice();
  const { nome } = useAuth();
  const [pet, setPet] = useState<PetResponseDto | null>(null);
  const [nextAppointment, setNextAppointment] = useState<AgendamentoResponseDto | null>(null);
  const [nearby, setNearby] = useState<PrestadorResponseDto[]>([]);

  useEffect(() => {
    petService.listar().then((list) => setPet(list[0] ?? null)).catch(() => {});
    agendamentoService
      .listar()
      .then((list) => {
        const upcoming = list
          .filter((item) => item.status !== "CANCELADO" && item.status !== "FINALIZADO")
          .sort((a, b) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
        setNextAppointment(upcoming[0] ?? null);
      })
      .catch(() => {});
    prestadorService.listarTopAvaliados(3).then(setNearby).catch(() => {});
  }, []);

  const firstName = (nome ?? "Mariana").split(/\s+/)[0];

  return (
    <div className="zoop-page zoop-stagger">
      <PageIntro title="Olá," accent={`${firstName}!`} description={pet ? `Como está ${pet.nome} hoje?` : "Acompanhe os cuidados do seu pet."} />

      <section className="zoop-tutor-overview">
        <TiltCard className="zoop-panel zoop-next-appointment zoop-reveal">
          <div className="zoop-panel__dark-title"><CalendarDays /> Próximo atendimento</div>
          {nextAppointment ? (
            <div className="zoop-next-appointment__body">
              <IconBadge><Stethoscope /></IconBadge>
              <div>
                <h2>{nextAppointment.servico ?? "Serviço"}</h2>
                <p><CalendarDays /> {formatDate(nextAppointment.dataHora)}</p>
                <p><Stethoscope /> {nextAppointment.prestador.nomePrestador}</p>
              </div>
            </div>
          ) : (
            <div className="zoop-next-appointment__body">
              <IconBadge><CalendarDays /></IconBadge>
              <div>
                <h2>Nenhum atendimento agendado</h2>
                <p>Explore os profissionais da rede Zoop.</p>
              </div>
            </div>
          )}
          <Link className="zoop-primary-button" href="/tutor/agendamentos">Ver detalhes <ChevronRight /></Link>
        </TiltCard>

        <TiltCard className="zoop-panel zoop-pet-summary zoop-reveal">
          <PetAvatar size="hero" />
          <div>
            <span className="zoop-eyebrow">Meu pet</span>
            <h2>{pet?.nome ?? "Seu pet"}</h2>
            <p>{pet ? `${pet.raca} • ${pet.idade} ${pet.idade === 1 ? "ano" : "anos"}` : "Cadastre um pet para agendar serviços."}</p>
            <Link className="zoop-secondary-button" href="/tutor/pets"><PawPrint /> Ver perfil</Link>
          </div>
        </TiltCard>

        <TiltCard className="zoop-panel zoop-reminders zoop-reveal">
          <div className="zoop-panel__heading"><h2>Lembretes</h2><BellRing /></div>
          <div className="zoop-reminder-item">
            <IconBadge><Syringe /></IconBadge>
            <div><strong>Vacina em dia</strong><span>Você será avisado sobre novas doses.</span></div>
            <StatusPill>Em dia</StatusPill>
          </div>
          <button className="zoop-secondary-button" type="button" onClick={() => notice("Todos os lembretes estão em dia.")}>Ver todos os lembretes</button>
        </TiltCard>
      </section>

      <section className="zoop-panel zoop-quick-services zoop-reveal">
        <div className="zoop-panel__heading"><div><span className="zoop-eyebrow">Atalhos</span><h2>Serviços rápidos</h2></div><HeartHandshake /></div>
        <div className="zoop-quick-services__grid">
          {quickServices.map(({ label, icon: Icon, query }) => (
            <Link href={`/servicos?categoria=${query}`} key={label}>
              <IconBadge><Icon /></IconBadge><span>{label}</span><ChevronRight />
            </Link>
          ))}
        </div>
      </section>

      <section className="zoop-panel zoop-nearby zoop-reveal">
        <div className="zoop-panel__heading">
          <div><span className="zoop-eyebrow">Rede Zoop</span><h2>Mais bem avaliados</h2></div>
          <Link href="/servicos">Ver todos <ChevronRight /></Link>
        </div>
        {nearby.length ? (
          <div className="zoop-nearby__grid">
            {nearby.map((professional, index) => (
              <TiltCard className="zoop-professional-mini" key={professional.id}>
                <PersonAvatar initials={initialsOf(professional.nomePrestador)} name={professional.nomePrestador} tone={tones[index % tones.length]} size="lg" />
                <div>
                  <h3>{professional.nomePrestador}</h3>
                  <p>{professional.type.replaceAll("_", " ")}</p>
                  <span><Star fill="currentColor" /> {(professional.avaliacaoMedia ?? 0).toFixed(1).replace(".", ",")} <b>•</b> <MapPin /> {[professional.bairro, professional.cidade].filter(Boolean).join(" · ") || "Salvador, BA"}</span>
                </div>
                <div className="zoop-professional-mini__meta">
                  <StatusPill>Disponível hoje</StatusPill>
                  <Link className="zoop-text-button" href={`/profissionais/armando?id=${professional.id}`}>Ver perfil <ChevronRight /></Link>
                </div>
              </TiltCard>
            ))}
          </div>
        ) : (
          <div className="zoop-empty-state"><h3>Nenhum profissional por aqui ainda</h3><p>Novos profissionais da rede Zoop aparecerão aqui.</p></div>
        )}
      </section>

      <section className="zoop-trust-strip zoop-reveal">
        <span><PawPrint /> Profissionais verificados</span>
        <span><BellRing /> Lembretes automáticos</span>
      </section>
    </div>
  );
}