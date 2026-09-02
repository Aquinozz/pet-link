"use client";

import { useEffect, useState } from "react";
import {
  Atom,
  CalendarDays,
  Download,
  FileHeart,
  HeartPulse,
  Pill,
  Plus,
  Scale,
  Stethoscope,
  Syringe,
  Venus,
  X,
} from "lucide-react";

import { useZoopNotice } from "@/components/zoop/app-shell";
import { useAuth } from "@/lib/auth";
import { IconBadge, PageIntro, PetAvatar, StatusPill, TiltCard } from "@/components/zoop/ui";
import { petService } from "@/lib/services";
import type { PetResponseDto } from "@/lib/types";

const especies = ["Cachorro", "Gato", "Coelho", "Ave", "Outro"];

export default function PetsPage() {
  const notice = useZoopNotice();
  const { tutorId } = useAuth();
  const [pets, setPets] = useState<PetResponseDto[]>([]);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nome: "", especie: "Cachorro", raca: "", idade: "" });
  const [formError, setFormError] = useState("");

  async function load() {
    try {
      setPets(await petService.listar());
    } catch {
      setPets([]);
    }
  }

  useEffect(() => {
    petService.listar().then(setPets).catch(() => setPets([]));
  }, []);

  const mainPet = pets[0];

  async function savePet(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    if (!tutorId) {
      setFormError("Sua sessão expirou. Entre novamente para continuar.");
      return;
    }
    const idade = Number(form.idade);
    if (!form.nome.trim() || !form.raca.trim() || !Number.isFinite(idade) || idade < 0) {
      setFormError("Preencha nome, raça e uma idade válida.");
      return;
    }
    setSaving(true);
    try {
      await petService.cadastrar({
        nome: form.nome.trim(),
        especie: form.especie,
        raca: form.raca.trim(),
        idade,
        tutorId,
      });
      setAdding(false);
      setForm({ nome: "", especie: "Cachorro", raca: "", idade: "" });
      notice("Pet cadastrado com sucesso.");
      load();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setFormError(message ?? "Não foi possível cadastrar o pet.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="zoop-page zoop-stagger">
      <PageIntro
        title="Meus pets"
        description="Cuide de todas as informações dos seus companheiros."
        action={<button className="zoop-primary-button" type="button" onClick={() => setAdding(true)}><Plus /> Adicionar pet</button>}
      />

      <section className="zoop-pet-profile-grid">
        <TiltCard className="zoop-panel zoop-pet-profile zoop-reveal">
          {mainPet?.fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="zoop-pet-avatar zoop-pet-avatar--hero zoop-pet-avatar--photo" src={mainPet.fotoUrl} alt={mainPet.nome} />
          ) : (
            <PetAvatar size="hero" />
          )}
          <div className="zoop-pet-profile__copy">
            <span className="zoop-eyebrow">{pets.length > 1 ? "Perfil principal" : "Perfil do pet"}</span>
            <h2>{mainPet?.nome ?? "Nenhum pet cadastrado"}</h2>
            <p>{mainPet ? `${mainPet.raca} • ${mainPet.idade} ${mainPet.idade === 1 ? "ano" : "anos"}` : "Adicione um pet para começar."}</p>
            <dl>
              <div><dt><HeartPulse /> Espécie</dt><dd>{mainPet?.especie ?? "—"}</dd></div>
              <div><dt><Venus /> Raça</dt><dd>{mainPet?.raca ?? "—"}</dd></div>
              <div><dt><Scale /> Idade</dt><dd>{mainPet != null ? `${mainPet.idade} anos` : "—"}</dd></div>
            </dl>
            <button className="zoop-secondary-button" type="button" onClick={() => notice("A edição de perfil estará disponível em breve.")}>Editar perfil</button>
          </div>
        </TiltCard>

        {pets.length > 1 && (
          <div className="zoop-pet-extra-list zoop-reveal">
            {pets.slice(1).map((pet) => (
              <TiltCard className="zoop-panel zoop-pet-extra" key={pet.id}>
                {pet.fotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="zoop-pet-avatar zoop-pet-avatar--md zoop-pet-avatar--photo" src={pet.fotoUrl} alt={pet.nome} />
                ) : (
                  <PetAvatar size="md" />
                )}
                <div><strong>{pet.nome}</strong><span>{pet.especie} • {pet.idade} {pet.idade === 1 ? "ano" : "anos"}</span></div>
              </TiltCard>
            ))}
          </div>
        )}

        <div className="zoop-health-grid zoop-reveal">
          <TiltCard className="zoop-panel zoop-health-card"><IconBadge><Syringe /></IconBadge><div><h3>Vacinas</h3><StatusPill>Em dia</StatusPill><p>Vacinação e reforços registrados.</p></div></TiltCard>
          <TiltCard className="zoop-panel zoop-health-card"><IconBadge><Atom /></IconBadge><div><h3>Alergias</h3><p>Informe seu veterinário sobre qualquer alergia.</p></div></TiltCard>
          <TiltCard className="zoop-panel zoop-health-card"><IconBadge><Pill /></IconBadge><div><h3>Medicamentos</h3><p>Acompanhamento registrado na rede Zoop.</p></div></TiltCard>
          <TiltCard className="zoop-panel zoop-health-card"><IconBadge><Stethoscope /></IconBadge><div><h3>Veterinário responsável</h3><p>Consulte na agenda de atendimentos.</p></div></TiltCard>
        </div>
      </section>

      <section className="zoop-pet-lower-grid">
        <div className="zoop-panel zoop-reveal">
          <div className="zoop-panel__heading"><div><span className="zoop-eyebrow">Linha do tempo</span><h2>Histórico recente</h2></div><HeartPulse /></div>
          <div className="zoop-timeline-item">
            <IconBadge><CalendarDays /></IconBadge>
            <div><h3>{mainPet ? `Acompanhamento de ${mainPet.nome}` : "Sem pets cadastrados"}</h3><p><CalendarDays /> Registros de consultas aparecerão aqui.</p><span>Histórico de saúde sincronizado com a agenda.</span></div>
          </div>
        </div>
        <div className="zoop-panel zoop-document-card zoop-reveal">
          <IconBadge><FileHeart /></IconBadge>
          <div><span className="zoop-eyebrow">Documento</span><h2>Carteira de vacinação</h2><p>Disponível para download dos seus registros.</p></div>
          <button className="zoop-secondary-button" type="button" onClick={() => notice("Carteira de vacinação preparada para download.")}><Download /> Baixar documento</button>
        </div>
      </section>

      {adding && (
        <div className="zoop-modal-layer" role="presentation" onMouseDown={() => setAdding(false)}>
          <div className="zoop-modal" role="dialog" aria-modal="true" aria-labelledby="add-pet-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="zoop-modal__close" type="button" onClick={() => setAdding(false)} aria-label="Fechar"><X /></button>
            <span className="zoop-eyebrow">Novo companheiro</span>
            <h2 id="add-pet-title">Adicionar pet</h2>
            <form className="zoop-form-grid" onSubmit={savePet}>
              <label><span>Nome</span><input value={form.nome} onChange={(event) => setForm((current) => ({ ...current, nome: event.target.value }))} required /></label>
              <label><span>Espécie</span><select value={form.especie} onChange={(event) => setForm((current) => ({ ...current, especie: event.target.value }))}>{especies.map((especie) => <option key={especie} value={especie}>{especie}</option>)}</select></label>
              <label><span>Raça</span><input value={form.raca} onChange={(event) => setForm((current) => ({ ...current, raca: event.target.value }))} required /></label>
              <label><span>Idade</span><input type="number" min={0} value={form.idade} onChange={(event) => setForm((current) => ({ ...current, idade: event.target.value }))} required /></label>
              {formError && <p className="zoop-auth-error" role="alert">{formError}</p>}
              <button className="zoop-primary-button" type="submit" disabled={saving}>{saving ? "Salvando..." : "Salvar pet"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}