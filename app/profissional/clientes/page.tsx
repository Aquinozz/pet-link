"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, FileHeart, MessageCircle, Search, Users } from "lucide-react";

import { useZoopNotice } from "@/components/zoop/app-shell";
import { AnimatedNumber, IconBadge, PageIntro, PersonAvatar, PetAvatar, StatusPill, TiltCard } from "@/components/zoop/ui";
import { agendamentoService } from "@/lib/services";
import type { AgendamentoResponseDto } from "@/lib/types";

type Client = {
  id: number;
  tutor: string;
  initials: string;
  pet: string;
  species: string;
  note: string;
  last: string;
  next: string;
  status: "Com retorno" | "Pendente" | "Novo";
  appointments: AgendamentoResponseDto[];
};

function formatShort(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ClientsPage() {
  const notice = useZoopNotice();
  const [appointments, setAppointments] = useState<AgendamentoResponseDto[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    agendamentoService.listar().then(setAppointments).catch(() => setAppointments([]));
  }, []);

  const clients = useMemo<Client[]>(() => {
    const grouped = new Map<string, Client>();
    appointments.forEach((item) => {
      const key = `${item.tutor.id}-${item.pet.id}`;
      const existing = grouped.get(key);
      const lastDone = item.status === "FINALIZADO" ? item.dataHora : null;
      const isUpcoming = item.status === "AGENDADO" || item.status === "CONFIRMADO";
      if (existing) {
        existing.appointments.push(item);
        if (lastDone) {
          const first = grouped.get(key)!;
          const lastDate = first.appointments
            .filter((a) => a.status === "FINALIZADO")
            .map((a) => new Date(a.dataHora).getTime());
          if (lastDate.length) first.last = formatShort(new Date(Math.max(...lastDate)).toISOString());
        }
      } else {
        grouped.set(key, {
          id: item.pet.id,
          tutor: item.tutor.nome,
          initials: item.tutor.nome.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
          pet: item.pet.nome,
          species: item.pet.especie,
          note: item.servico ?? "Registrado na rede Zoop",
          last: formatShort(item.dataHora),
          next: isUpcoming ? formatShort(item.dataHora) : "—",
          status: isUpcoming ? "Com retorno" : "Novo",
          appointments: [item],
        });
      }
    });
    return Array.from(grouped.values());
  }, [appointments]);

  const selected = useMemo(
    () => clients.find((client) => client.id === selectedId) ?? clients[0],
    [clients, selectedId]
  );

  const filtered = useMemo(() => clients.filter((client) => {
    const matchesQuery = `${client.tutor} ${client.pet}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === "Todos" || (filter === "Com retorno" ? client.status === "Com retorno" : client.status === "Pendente" || client.status === "Novo");
    return matchesQuery && matchesFilter;
  }), [clients, filter, query]);

  const pendingReturns = useMemo(() => appointments.filter((item) => item.status === "AGENDADO").length, [appointments]);

  return (
    <div className="zoop-page zoop-stagger">
      <PageIntro title="Clientes e pets" description="Organize seus pacientes e responsáveis." />

      <div className="zoop-client-tools zoop-reveal">
        <label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cliente ou pet" /></label>
        <div className="zoop-segmented-control">{["Todos", "Com retorno", "Novos"].map((item) => <button className={filter === item ? "is-active" : ""} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
      </div>

      <section className="zoop-metric-grid zoop-metric-grid--three zoop-reveal">
        <TiltCard className="zoop-panel zoop-metric-card"><IconBadge><Users /></IconBadge><div><span>Clientes ativos</span><strong><AnimatedNumber value={clients.length} /></strong></div></TiltCard>
        <TiltCard className="zoop-panel zoop-metric-card"><IconBadge><FileHeart /></IconBadge><div><span>Pets atendidos</span><strong><AnimatedNumber value={clients.length} /></strong></div></TiltCard>
        <TiltCard className="zoop-panel zoop-metric-card"><IconBadge><CalendarDays /></IconBadge><div><span>Retornos pendentes</span><strong><AnimatedNumber value={pendingReturns} /></strong></div></TiltCard>
      </section>

      <div className="zoop-clients-layout">
        <section className="zoop-panel zoop-clients-table zoop-reveal">
          <div className="zoop-table-head"><span>Tutor</span><span>Pet</span><span>Espécie</span><span>Último registro</span><span>Próximo atendimento</span><span>Status</span></div>
          {filtered.map((client) => (
            <button className={selected?.id === client.id ? "is-selected" : ""} type="button" onClick={() => setSelectedId(client.id)} key={client.id}>
              <span><PersonAvatar initials={client.initials} name={client.tutor} tone="rose" size="sm" />{client.tutor}</span>
              <span><PersonAvatar initials={client.pet.slice(0, 2).toUpperCase()} name={client.pet} tone="green" size="sm" />{client.pet}</span>
              <span>{client.species}</span><span>{client.last}</span><span>{client.next}</span>
              <StatusPill tone={client.status === "Com retorno" ? "success" : "info"}>{client.status}</StatusPill>
            </button>
          ))}
          {!filtered.length && (
            <div className="zoop-client-empty"><p>Nenhum cliente encontrado.</p></div>
          )}
        </section>

        <aside className="zoop-panel zoop-client-detail zoop-reveal">
          {selected ? (
            <>
              <div className="zoop-client-detail__identity"><PersonAvatar initials={selected.initials} name={selected.tutor} tone="rose" size="lg" /><div><h2>{selected.tutor}</h2><p>Tutora responsável</p></div></div>
              <div className="zoop-client-detail__pet"><PetAvatar size="lg" /><div><h3>{selected.pet}</h3><p>{selected.species} • {selected.appointments.length} atendimento(s)</p></div></div>
              <dl><div><dt>Última consulta</dt><dd>{selected.last}</dd></div><div><dt>Próximo atendimento</dt><dd>{selected.next}</dd></div></dl>
              <button className="zoop-primary-button" type="button" onClick={() => notice(`Histórico de ${selected.pet} aberto.`)}><FileHeart /> Ver prontuário</button>
              <button className="zoop-secondary-button" type="button" onClick={() => notice(`Conversa com ${selected.tutor} aberta.`)}><MessageCircle /> Enviar mensagem</button>
              <div className="zoop-client-note"><strong>Último serviço</strong><p>{selected.note}</p><small>Atualizado em {selected.last}</small></div>
            </>
          ) : null}
        </aside>
      </div>
    </div>
  );
}