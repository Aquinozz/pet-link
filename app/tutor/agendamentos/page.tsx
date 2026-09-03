"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bell, CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Plus, Stethoscope } from "lucide-react";

import { useZoopNotice } from "@/components/zoop/app-shell";
import { PageIntro, PetAvatar, StatusPill } from "@/components/zoop/ui";
import { agendamentoService } from "@/lib/services";
import { formatPrestadorType } from "@/lib/format";
import type { AgendamentoResponseDto } from "@/lib/types";

type Tab = "Próximos" | "Concluídos" | "Cancelados";

const statusMeta: Record<string, { label: string; tone: "success" | "warning" | "neutral" }> = {
  AGENDADO: { label: "Aguardando confirmação", tone: "warning" },
  CONFIRMADO: { label: "Confirmado", tone: "success" },
  FINALIZADO: { label: "Concluído", tone: "success" },
  CANCELADO: { label: "Cancelado", tone: "neutral" },
};

export default function AppointmentsPage() {
  const notice = useZoopNotice();
  const [tab, setTab] = useState<Tab>("Próximos");
  const [appointments, setAppointments] = useState<AgendamentoResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setAppointments(await agendamentoService.listar());
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    agendamentoService.listar().then(setAppointments).catch(() => setAppointments([])).finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => appointments.filter((item) => {
    if (tab === "Próximos") return item.status === "AGENDADO" || item.status === "CONFIRMADO";
    if (tab === "Concluídos") return item.status === "FINALIZADO";
    return item.status === "CANCELADO";
  }), [appointments, tab]);

  async function cancelAppointment(id: number, title: string) {
    try {
      await agendamentoService.atualizarStatus(id, "CANCELADO");
      notice(`${title} cancelado com sucesso.`);
      load();
    } catch {
      notice("Não foi possível cancelar o agendamento.");
    }
  }

  const days = Array.from({ length: 30 }, (_, index) => index + 1);
  const eventDays = useMemo(() => appointments.map((item) => new Date(item.dataHora).getDate()), [appointments]);

  return (
    <div className="zoop-page zoop-stagger">
      <PageIntro
        title="Meus"
        accent="agendamentos"
        description="Acompanhe e organize os cuidados do seu pet."
        action={<Link className="zoop-primary-button" href="/servicos"><Plus /> Agendar novo serviço</Link>}
      />

      <div className="zoop-appointments-layout">
        <section className="zoop-reveal">
          <div className="zoop-tabs" role="tablist" aria-label="Filtrar agendamentos">
            {(["Próximos", "Concluídos", "Cancelados"] as Tab[]).map((label) => <button type="button" role="tab" aria-selected={tab === label} className={tab === label ? "is-active" : ""} onClick={() => setTab(label)} key={label}>{label}</button>)}
          </div>
          <div className="zoop-appointment-list">
            {loading ? (
              <div className="zoop-panel zoop-tab-empty"><Clock /><h2>Carregando agendamentos...</h2></div>
            ) : visible.length ? visible.map((appointment) => {
              const date = new Date(appointment.dataHora);
              const meta = statusMeta[appointment.status] ?? { label: appointment.status, tone: "neutral" as const };
              return (
                <article className="zoop-panel zoop-appointment-card" key={appointment.id}>
                  <time><span>{date.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase().replace(".", "")}</span><strong>{String(date.getDate()).padStart(2, "0")}</strong><small>{date.toLocaleDateString("pt-BR", { weekday: "short" }).toUpperCase()}</small></time>
                  <PetAvatar size="md" />
                  <div className="zoop-appointment-card__copy">
                    <h2>{appointment.servico ?? "Serviço"}</h2>
                    <p><Stethoscope /> {appointment.prestador?.nomePrestador}</p>
                    <span>{formatPrestadorType(appointment.prestador?.type)}</span>
                    <small><CalendarDays /> {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })} • {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</small>
                    <small><MapPin /> {[appointment.prestador?.bairro, appointment.prestador?.cidade].filter(Boolean).join(", ") || "Salvador"}</small>
                  </div>
                  <div className="zoop-appointment-card__actions">
                    <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
                    {appointment.status !== "CANCELADO" && appointment.status !== "FINALIZADO" && (
                      <>
                        <button className="zoop-primary-button" type="button" onClick={() => notice(`Detalhes de ${appointment.servico ?? "serviço"} abertos.`)}>Ver detalhes</button>
                        <button className="zoop-secondary-button" type="button" onClick={() => cancelAppointment(appointment.id, appointment.servico ?? "agendamento")}>Cancelar</button>
                      </>
                    )}
                  </div>
                </article>
              );
            }) : (
              <div className="zoop-panel zoop-tab-empty"><CalendarDays /><h2>Nenhum agendamento {tab.toLowerCase()}</h2><p>Quando houver registros, eles aparecerão aqui.</p></div>
            )}
          </div>
          <div className="zoop-info-strip"><Bell /> Lembrete: você receberá uma notificação 24 horas antes.</div>
        </section>

        <aside className="zoop-panel zoop-calendar zoop-reveal">
          <div className="zoop-calendar__heading"><button type="button" aria-label="Mês anterior"><ChevronLeft /></button><h2>{new Date().toLocaleDateString("pt-BR", { month: "long" }).replace(/^\w/, (c) => c.toUpperCase())}</h2><button type="button" aria-label="Próximo mês"><ChevronRight /></button></div>
          <div className="zoop-calendar__week"><span>DOM</span><span>SEG</span><span>TER</span><span>QUA</span><span>QUI</span><span>SEX</span><span>SÁB</span></div>
          <div className="zoop-calendar__days">
            {days.map((day) => <button type="button" className={eventDays.includes(day) ? "has-event" : ""} key={day}>{day}</button>)}
          </div>
          <div className="zoop-calendar__legend"><span><i /> {appointments.length} agendamento(s) no mês</span></div>
          <div className="zoop-calendar__next"><Clock /><div><strong>{appointments.length ? "Agenda sincronizada" : "Nenhum horário agendado"}</strong><span>Atualizada com a rede Zoop</span></div></div>
        </aside>
      </div>
    </div>
  );
}