"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock, Copy, EllipsisVertical, History, Pencil, Plus, Save, ShieldCheck, Stethoscope, Syringe, Tag } from "lucide-react";

import { useZoopNotice } from "@/components/zoop/app-shell";
import { IconBadge, PageIntro, TiltCard } from "@/components/zoop/ui";
import { authService, prestadorService } from "@/lib/services";

type ServiceItem = {
  id: number;
  title: string;
  category: string;
  icon: "stethoscope" | "history" | "syringe";
};

const iconMap = { stethoscope: Stethoscope, history: History, syringe: Syringe };

function iconFor(title: string) {
  const value = title.toLowerCase();
  if (value.includes("vacina") || value.includes("medicamento")) return "syringe" as const;
  if (value.includes("retorno") || value.includes("acompanhamento")) return "history" as const;
  return "stethoscope" as const;
}

export default function ProfessionalServicesPage() {
  const notice = useZoopNotice();
  const [horario, setHorario] = useState("");
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [category, setCategory] = useState("Todos os serviços");
  const [active, setActive] = useState<Record<number, boolean>>({});
  const [menu, setMenu] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    authService
      .me()
      .then((me) => {
        setHorario(me.horarioFuncionamento ?? "");
        const items = (me.servicos ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .map((title, index) => ({ id: index, title, category: "Serviços", icon: iconFor(title) }));
        setServices(items);
        setActive(Object.fromEntries(items.map((item) => [item.id, true])));
      })
      .catch(() => {});
  }, []);

  const visible = useMemo(
    () => category === "Todos os serviços" ? services : services.filter((service) => service.category === category),
    [category, services]
  );

  async function save() {
    setSaving(true);
    const servicos = services
      .filter((service) => active[service.id])
      .map((service) => service.title)
      .join(", ");
    try {
      await prestadorService.atualizarPerfil({ servicos, horarioFuncionamento: horario || undefined });
      notice("Serviços e preços salvos com sucesso.");
    } catch {
      notice("Não foi possível salvar os serviços.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="zoop-page zoop-stagger">
      <PageIntro title="Serviços e preços" description="Gerencie o que você oferece aos tutores." action={<button className="zoop-primary-button" type="button" onClick={() => notice("Formulário de novo serviço aberto.")}><Plus /> Novo serviço</button>} />
      <div className="zoop-tabs zoop-reveal">{["Todos os serviços", "Consultas", "Retornos", "Procedimentos"].map((item) => <button className={category === item ? "is-active" : ""} type="button" onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>

      <section className="zoop-service-management-grid zoop-reveal">
        {services.length === 0 && (
          <div className="zoop-empty-state"><h3>Nenhum serviço cadastrado</h3><p>Adicione seus serviços para aparecer nas buscas da Zoop.</p></div>
        )}
        {visible.map((service) => {
          const Icon = iconMap[service.icon];
          return (
            <TiltCard className="zoop-panel zoop-service-management-card" key={service.id}>
              <IconBadge><Icon /></IconBadge>
              <div className="zoop-service-management-card__copy"><h2>{service.title}</h2><p>Registrado na rede Zoop.</p></div>
              <div className="zoop-card-menu">
                <button type="button" aria-label="Mais opções" onClick={() => setMenu(menu === service.id ? null : service.id)}><EllipsisVertical /></button>
                {menu === service.id && <div><button type="button" onClick={() => notice(`Editando ${service.title}.`)}><Pencil /> Editar</button><button type="button" onClick={() => notice(`${service.title} duplicado.`)}><Copy /> Duplicar</button></div>}
              </div>
              <footer><span><Clock /> {horario || "Horário flexível"}</span><span><Tag /> Valor sob consulta</span><button className={`zoop-switch ${active[service.id] ? "is-active" : ""}`} type="button" role="switch" aria-checked={active[service.id]} onClick={() => setActive((current) => ({ ...current, [service.id]: !current[service.id] }))}><i /><span>{active[service.id] ? "Ativo" : "Inativo"}</span></button></footer>
            </TiltCard>
          );
        })}
      </section>

      <section className="zoop-service-bottom-grid zoop-reveal">
        <div className="zoop-panel zoop-package-card"><div><IconBadge><Tag /></IconBadge><span><h2>Pacotes e descontos</h2><p>Crie combinações de serviços e incentive a fidelização.</p></span></div><button className="zoop-secondary-button" type="button" onClick={() => notice("Configuração de pacotes aberta.")}>Configurar</button></div>
        <div className="zoop-panel zoop-policy-card"><div><IconBadge><ShieldCheck /></IconBadge><span><h2>Políticas de atendimento</h2><p>Cancelamento gratuito até 24 horas antes.</p></span></div><button className="zoop-secondary-button" type="button" onClick={() => notice("Editor de políticas aberto.")}>Editar</button></div>
      </section>
      <div className="zoop-save-row zoop-reveal"><button className="zoop-primary-button" type="button" disabled={saving} onClick={save}><Save /> {saving ? "Salvando..." : "Salvar alterações"}</button></div>
    </div>
  );
}