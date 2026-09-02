"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronRight, Download, FileHeart, FlaskConical, Scale, Stethoscope, Syringe } from "lucide-react";

import { useZoopNotice } from "@/components/zoop/app-shell";
import { AnimatedNumber, IconBadge, PageIntro, TiltCard } from "@/components/zoop/ui";
import { agendamentoService } from "@/lib/services";
import type { AgendamentoResponseDto } from "@/lib/types";

function iconFor(title: string) {
  const value = title?.toLowerCase() ?? "";
  if (value.includes("vacina")) return Syringe;
  if (value.includes("banho") || value.includes("tosa")) return FileHeart;
  return Stethoscope;
}

export default function HistoryPage() {
  const notice = useZoopNotice();
  const [records, setRecords] = useState<AgendamentoResponseDto[]>([]);
  const [expanded, setExpanded] = useState<number | null>(0);

  useEffect(() => {
    agendamentoService
      .listar()
      .then((list) => setRecords(list.filter((item) => item.status === "FINALIZADO")))
      .catch(() => setRecords([]));
  }, []);

  const timeline = useMemo(() => records
    .map((record) => ({ record, date: new Date(record.dataHora) }))
    .sort((a, b) => b.date.getTime() - a.date.getTime()),
  [records]);

  return (
    <div className="zoop-page zoop-stagger">
      <PageIntro
        title="Histórico de"
        accent="cuidados"
        description="Todos os atendimentos realizados em um só lugar."
        action={<button className="zoop-secondary-button" type="button" onClick={() => notice("Histórico completo preparado para download.")}><Download /> Baixar histórico</button>}
      />

      <section className="zoop-metric-grid zoop-metric-grid--three zoop-reveal">
        <TiltCard className="zoop-panel zoop-metric-card"><IconBadge><Stethoscope /></IconBadge><div><span>Atendimentos concluídos</span><strong><AnimatedNumber value={records.length} /></strong></div></TiltCard>
        <TiltCard className="zoop-panel zoop-metric-card"><IconBadge><CalendarDays /></IconBadge><div><span>Última consulta</span><strong><AnimatedNumber value={records.length ? 1 : 0} /></strong><small>{records[0] ? new Date(records[0].dataHora).toLocaleDateString("pt-BR") : "—"}</small></div></TiltCard>
        <TiltCard className="zoop-panel zoop-metric-card"><IconBadge><Scale /></IconBadge><div><span>Histórico completo</span><strong><AnimatedNumber value={records.length} /></strong><small>registro(s) na rede Zoop</small></div></TiltCard>
      </section>

      <div className="zoop-history-layout">
        <section className="zoop-panel zoop-history-timeline zoop-reveal">
          <div className="zoop-panel__heading"><div><span className="zoop-eyebrow">Registros</span><h2>Linha do tempo</h2></div><CalendarDays /></div>
          {timeline.map(({ record, date }, index) => {
            const Icon = iconFor(record.servico ?? "");
            return (
              <article className={`zoop-history-record ${expanded === index ? "is-expanded" : ""}`} key={record.id}>
                <time><strong>{String(date.getDate()).padStart(2, "0")}</strong><span>{date.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase().replace(".", "")}<br />{date.getFullYear()}</span></time>
                <div className="zoop-history-record__line"><i /></div>
                <IconBadge><Icon /></IconBadge>
                <button type="button" onClick={() => setExpanded(expanded === index ? null : index)}>
                  <span><strong>{record.servico ?? "Atendimento"}</strong><small>{record.prestador?.nomePrestador}</small>{expanded === index && <em>Status: {record.status} • Pet: {record.pet?.nome}</em>}</span><ChevronRight />
                </button>
              </article>
            );
          })}
          {!timeline.length && (
            <div className="zoop-tab-empty"><CalendarDays /><h2>Nenhum atendimento concluído</h2><p>Quando houver registros, eles aparecerão aqui.</p></div>
          )}
        </section>

        <aside className="zoop-reveal">
          <div className="zoop-panel zoop-filter-panel">
            <h2>Filtros</h2>
            <label><span>Tipo de registro</span><select><option>Todos os tipos</option><option>Consultas</option><option>Banho e Tosa</option></select></label>
            <label><span>Ano</span><select><option>Todos os anos</option><option>{new Date().getFullYear()}</option></select></label>
            <button className="zoop-primary-button" type="button" onClick={() => notice("Filtros aplicados ao histórico.")}>Aplicar filtros</button>
          </div>
          <div className="zoop-panel zoop-documents-panel">
            <h2>Documentos</h2>
            {[{ label: "Carteira de vacinação", icon: FileHeart }, { label: "Receita médica", icon: Stethoscope }, { label: "Resultado de exame", icon: FlaskConical }].map(({ label, icon: Icon }) => (
              <button type="button" key={label} onClick={() => notice(`${label} preparado para download.`)}><Icon /><span>{label}</span><Download /></button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}