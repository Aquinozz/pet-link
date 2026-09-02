"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, ChevronLeft, ChevronRight, MapPin, RotateCcw, Stethoscope, Trash2 } from "lucide-react";

import { useZoopNotice } from "@/components/zoop/app-shell";
import { PageIntro, PersonAvatar, PetAvatar, StatusPill } from "@/components/zoop/ui";
import { agendamentoService } from "@/lib/services";
import type { AgendamentoResponseDto } from "@/lib/types";

type AgendaEvent = {
  id: number;
  day: number;
  top: number;
  span: number;
  time: string;
  title: string;
  pet: string;
  tutor: string;
  tone: string;
  appointment: AgendamentoResponseDto;
};

const hours = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
const days = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const tonePool = ["green", "gold", "purple"];

export default function ProfessionalAgenda() {
  const notice = useZoopNotice();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [appointments, setAppointments] = useState<AgendamentoResponseDto[]>([]);

  function refresh() {
    agendamentoService
      .listar()
      .then(setAppointments)
      .catch(() => setAppointments([]));
  }

  useEffect(refresh, []);

  const events = useMemo<AgendaEvent[]>(() => appointments
    .filter((item) => item.status !== "CANCELADO")
    .map((item, index) => {
      const date = new Date(item.dataHora);
      const day = date.getDay() - 1;
      const clampDay = day >= 0 && day <= 5 ? day : 0;
      const hour = date.getHours();
      const hourIndex = Math.max(0, Math.min(hours.length - 1, hour) - 8);
      const tone = tonePool[index % tonePool.length];
      return {
        id: item.id,
        day: clampDay,
        top: Math.max(0, hourIndex),
        span: 2,
        time: date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        title: item.servico ?? "Serviço",
        pet: item.pet.nome,
        tutor: item.tutor.nome,
        tone,
        appointment: item,
      };
    }),
  [appointments]);

  const selectedEvent = useMemo(() => {
    if (!events.length) return null;
    return events.find((event) => event.id === selectedId) ?? events[0];
  }, [events, selectedId]);

  async function setStatus(id: number, status: string, message: string) {
    try {
      await agendamentoService.atualizarStatus(id, status);
      notice(message);
      refresh();
    } catch {
      notice("Não foi possível atualizar o atendimento.");
    }
  }

  const start = useMemo(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    return monday;
  }, []);

  const dateLabels = useMemo(() => days.map((day, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return { day, label: String(date.getDate()).padStart(2, "0"), month: String(date.getMonth() + 1).padStart(2, "0") };
  }), [start]);

  return (
    <div className="zoop-page zoop-stagger">
      <PageIntro
        title="Minha agenda"
        description="Visualize horários, confirme atendimentos e mantenha sua semana organizada."
      />
      <div className="zoop-agenda-toolbar zoop-reveal">
        <button type="button" aria-label="Semana anterior"><ChevronLeft /></button><strong>{start.toLocaleDateString("pt-BR")} — {new Date(start.getTime() + 6 * 86400000).toLocaleDateString("pt-BR")}</strong><button type="button" aria-label="Próxima semana"><ChevronRight /></button><button className="zoop-secondary-button" type="button">Hoje</button>
      </div>

      <div className="zoop-agenda-layout">
        <section className="zoop-panel zoop-week-calendar zoop-reveal">
          <div className="zoop-week-calendar__header"><span />{dateLabels.map((item, index) => <div className={index === 3 ? "is-today" : ""} key={item.day}><strong>{item.day}</strong><small>{item.label}/{item.month}</small></div>)}</div>
          <div className="zoop-week-calendar__body">
            <div className="zoop-week-calendar__times">{hours.map((hour) => <span key={hour}>{hour}</span>)}</div>
            <div className="zoop-week-calendar__grid">{days.flatMap((day) => hours.map((hour) => <span key={`${day}-${hour}`} />))}</div>
            {events.map((event) => (
              <button
                type="button"
                className={`zoop-agenda-event zoop-agenda-event--${event.tone} ${selectedEvent?.id === event.id ? "is-selected" : ""}`}
                style={{ gridColumn: event.day + 2, gridRow: `${event.top + 1} / span ${event.span}` }}
                onClick={() => setSelectedId(event.id)}
                key={event.id}
              >
                <span>{event.time}</span><strong>{event.title}</strong><small>{event.pet}</small>
              </button>
            ))}
            {!events.length && <div className="zoop-agenda-empty">Nenhum atendimento programado para esta semana.</div>}
          </div>
        </section>

        <aside className="zoop-panel zoop-appointment-detail zoop-reveal">
          <div className="zoop-panel__heading"><h2>Detalhes do atendimento</h2><CalendarDays /></div>
          {selectedEvent ? (
            <>
              <div className="zoop-appointment-detail__pet"><PetAvatar size="lg" /><div><h3>{selectedEvent.pet}</h3><p>{selectedEvent.appointment.pet.raca} • {selectedEvent.appointment.pet.idade} {selectedEvent.appointment.pet.idade === 1 ? "ano" : "anos"}</p></div></div>
              <div className="zoop-detail-list">
                <p><PersonAvatar initials={selectedEvent.tutor.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()} name={selectedEvent.tutor} tone="rose" size="sm" /><span><strong>Tutora: {selectedEvent.tutor}</strong><small>{selectedEvent.appointment.tutor.email}</small></span></p>
                <p><Stethoscope /><span><strong>{selectedEvent.title}</strong><small>{new Date(selectedEvent.appointment.dataHora).toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}, {selectedEvent.time}</small></span></p>
                <p><MapPin /><span><strong>{[selectedEvent.appointment.enderecoAtendimento, selectedEvent.appointment.prestador?.cidade].filter(Boolean).join(", ") || "Atendimento na rede Zoop"}</strong><small>{selectedEvent.appointment.atendimentoDomiciliar ? "Atendimento domiciliar" : "Atendimento presencial"}</small></span></p>
              </div>
              <StatusPill tone={selectedEvent.appointment.status === "AGENDADO" ? "warning" : "success"}>{selectedEvent.appointment.status}</StatusPill>
              <button className="zoop-primary-button" type="button" onClick={() => setStatus(selectedEvent.id, "CONFIRMADO", "Atendimento confirmado com sucesso.")}><Check /> Confirmar</button>
              <div className="zoop-split-actions"><button className="zoop-secondary-button" type="button" onClick={() => setStatus(selectedEvent.id, "FINALIZADO", "Atendimento finalizado.")}><RotateCcw /> Finalizar</button><button className="zoop-danger-button" type="button" onClick={() => setStatus(selectedEvent.id, "CANCELADO", "Atendimento cancelado.")}><Trash2 /> Cancelar</button></div>
            </>
          ) : (
            <div className="zoop-agenda-empty"><p>Selecione um atendimento para ver os detalhes.</p></div>
          )}
        </aside>
      </div>
    </div>
  );
}