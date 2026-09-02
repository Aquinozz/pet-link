"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Check, ChevronRight, Clock, Plus, Star, TrendingUp, UserRoundCheck, Users, X } from "lucide-react";

import { useZoopNotice } from "@/components/zoop/app-shell";
import { useAuth } from "@/lib/auth";
import { AnimatedNumber, IconBadge, PageIntro, PersonAvatar, StatusPill, TiltCard } from "@/components/zoop/ui";
import { agendamentoService, prestadorService } from "@/lib/services";
import type { AgendamentoResponseDto, PrestadorResponseDto } from "@/lib/types";

function timeOnly(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function isToday(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  return date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
}

const statusTone: Record<string, "success" | "warning" | "neutral"> = {
  AGENDADO: "warning",
  CONFIRMADO: "success",
  FINALIZADO: "success",
  CANCELADO: "neutral",
};

export default function ProfessionalDashboard() {
  const notice = useZoopNotice();
  const { nome } = useAuth();
  const [appointments, setAppointments] = useState<AgendamentoResponseDto[]>([]);
  const [profile, setProfile] = useState<PrestadorResponseDto | null>(null);
  const [requests, setRequests] = useState<AgendamentoResponseDto[]>([]);

  async function load() {
    try {
      const list = await agendamentoService.listar();
      setAppointments(list);
      setRequests(list.filter((item) => item.status === "AGENDADO"));
    } catch {
      setRequests([]);
      setAppointments([]);
    }
  }

  useEffect(() => {
    agendamentoService
      .listar()
      .then((list) => {
        setAppointments(list);
        setRequests(list.filter((item) => item.status === "AGENDADO"));
      })
      .catch(() => {
        setRequests([]);
        setAppointments([]);
      });
    prestadorService.listarTopAvaliados(1).then(([top]) => setProfile(top ?? null)).catch(() => {});
  }, []);

  async function resolveRequest(id: number, accepted: boolean) {
    try {
      await agendamentoService.atualizarStatus(id, accepted ? "CONFIRMADO" : "CANCELADO");
      notice(accepted ? "Solicitação aceita e adicionada à agenda." : "Solicitação recusada.");
      load();
    } catch {
      notice("Não foi possível atualizar a solicitação.");
    }
  }

  const today = useMemo(
    () => appointments.filter((item) => isToday(item.dataHora) && item.status !== "CANCELADO"),
    [appointments]
  );
  const firstName = (nome ?? "Dr. Armando").split(/\s+/)[0];

  return (
    <div className="zoop-page zoop-stagger">
      <PageIntro
        title={`Olá, ${firstName}!`}
        description="Aqui está o resumo do seu dia."
        action={<Link className="zoop-primary-button" href="/profissional/agenda"><Plus /> Ver agenda</Link>}
      />

      <section className="zoop-metric-grid zoop-metric-grid--four zoop-reveal">
        <TiltCard className="zoop-panel zoop-metric-card"><IconBadge><CalendarDays /></IconBadge><div><span>Atendimentos hoje</span><strong><AnimatedNumber value={today.length} /></strong><small><TrendingUp /> agenda do dia</small></div></TiltCard>
        <TiltCard className="zoop-panel zoop-metric-card"><IconBadge><Clock /></IconBadge><div><span>Confirmações pendentes</span><strong><AnimatedNumber value={requests.length} /></strong><small>Requer atenção</small></div></TiltCard>
        <TiltCard className="zoop-panel zoop-metric-card"><IconBadge><Users /></IconBadge><div><span>Agendamentos totais</span><strong><AnimatedNumber value={appointments.length} /></strong><small><TrendingUp /> no sistema</small></div></TiltCard>
        <TiltCard className="zoop-panel zoop-metric-card"><IconBadge><Star /></IconBadge><div><span>Avaliação média</span><strong>{profile?.avaliacaoMedia != null ? profile.avaliacaoMedia.toFixed(1).replace(".", ",") : "—"}</strong><small className="zoop-stars">★★★★★</small></div></TiltCard>
      </section>

      <div className="zoop-professional-overview">
        <section className="zoop-panel zoop-schedule-table zoop-reveal">
          <div className="zoop-panel__heading"><div><span className="zoop-eyebrow">Hoje</span><h2>Agenda de hoje</h2></div><Link href="/profissional/agenda">Ver agenda completa <ChevronRight /></Link></div>
          <div className="zoop-table-head"><span>Horário</span><span>Pet e tutor</span><span>Serviço</span><span>Status</span></div>
          {today.map((appointment, index) => (
            <article className="zoop-schedule-row" key={appointment.id}>
              <time>{timeOnly(appointment.dataHora)}</time>
              <div><PersonAvatar initials={appointment.pet.nome.slice(0, 2).toUpperCase()} name={appointment.pet.nome} tone={index % 2 ? "gold" : "green"} size="sm" /><span><strong>{appointment.pet.nome}</strong><small>{appointment.tutor.nome}</small></span></div>
              <p>{appointment.servico ?? "Serviço"}</p>
              <StatusPill tone={statusTone[appointment.status] ?? "neutral"}>{appointment.status}</StatusPill>
            </article>
          ))}
          {!today.length && (
            <div className="zoop-schedule-empty"><p>Nenhum atendimento programado para hoje.</p><Link href="/profissional/agenda">Ver agenda completa</Link></div>
          )}
        </section>

        <aside className="zoop-professional-side zoop-reveal">
          <section className="zoop-panel zoop-requests">
            <div className="zoop-panel__heading"><h2>Solicitações pendentes</h2><StatusPill tone="warning">{requests.length}</StatusPill></div>
            {requests.length ? requests.map((request) => (
              <article key={request.id}>
                <PersonAvatar initials={request.pet.nome.slice(0, 2).toUpperCase()} name={request.pet.nome} tone="gold" />
                <div><h3>{request.pet.nome} <span>• {request.tutor.nome}</span></h3><p>{request.servico ?? "Serviço"}</p><small>{timeOnly(request.dataHora)} • {new Date(request.dataHora).toLocaleDateString("pt-BR")}</small></div>
                <div><button type="button" aria-label="Aceitar" onClick={() => resolveRequest(request.id, true)}><Check /></button><button type="button" aria-label="Recusar" onClick={() => resolveRequest(request.id, false)}><X /></button></div>
              </article>
            )) : <div className="zoop-requests__empty"><UserRoundCheck /><p>Tudo confirmado por aqui.</p></div>}
          </section>

          <section className="zoop-panel zoop-availability">
            <div className="zoop-panel__heading"><h2>Disponibilidade</h2><CalendarDays /></div>
            <div className="zoop-availability-note"><p>{profile?.horarioFuncionamento ? `Horário informado: ${profile.horarioFuncionamento}` : "Configure seu horário de atendimento no seu perfil."}</p></div>
            <Link className="zoop-secondary-button" href="/profissional/agenda">Editar disponibilidade</Link>
          </section>
        </aside>
      </div>
    </div>
  );
}