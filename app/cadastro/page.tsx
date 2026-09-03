"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BriefcaseMedical, Eye, EyeOff, LockKeyhole, Mail, Mailbox, PawPrint, ShieldCheck, User } from "lucide-react";

import { ZoopLogo } from "@/components/zoop/brand";
import { authService } from "@/lib/services";
import { useAuth } from "@/lib/auth";

export default function CadastroPage() {
  const router = useRouter();
  const { signIn, setTutorId, setNome, setFotoUrl } = useAuth();
  const [role, setRole] = useState<"tutor" | "professional">("tutor");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const nome = String(form.get("nome") ?? "");
    const email = String(form.get("email") ?? "");
    const senha = String(form.get("senha") ?? "");
    const confirmar = String(form.get("confirmar") ?? "");

    if (senha !== confirmar) {
      setError("As senhas não coincidem.");
      setLoading(false);
      return;
    }

    try {
      await authService.register({ nome, email, senha });
      const { token } = await authService.login({ email, senha });
      signIn(token);
      const me = await authService.me();
      setTutorId(me.id);
      setNome(me.nome);
      setFotoUrl(me.fotoUrl ?? null);
      router.push("/tutor");
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "Não foi possível criar sua conta. Verifique os dados e tente novamente.");
      setLoading(false);
    }
  }

  return (
    <main className="zoop-login-page">
      <header className="zoop-login-header"><ZoopLogo compact /><Link href="/">Voltar ao site</Link></header>
      <section className="zoop-login-visual">
        <div className="zoop-login-visual__orb" aria-hidden="true" />
        <div className="zoop-login-brand-copy">
          <span className="zoop-eyebrow">Bem-vindo à Zoop</span>
          <h1>Conectando quem <strong>ama</strong>,<br />com quem <strong>cuida.</strong></h1>
          <p>Crie sua conta gratuita e comece a cuidar do seu pet com quem entende.</p>
          <div><span><ShieldCheck /> Profissionais verificados</span><span><PawPrint /> Tudo sobre seu pet em um só lugar</span></div>
        </div>
        <div className="zoop-login-pets" role="img" aria-label="Golden Retriever e gato da Zoop" />
      </section>

      <section className="zoop-login-form-wrap">
        <form className="zoop-login-card" onSubmit={submit}>
          <span className="zoop-eyebrow">Comece agora</span>
          <h2>Criar conta na Zoop</h2>
          <p>Escolha o tipo de conta pra continuar.</p>
          <div className="zoop-role-selector" role="tablist" aria-label="Tipo de conta">
            <button className={role === "tutor" ? "is-active" : ""} type="button" role="tab" aria-selected={role === "tutor"} onClick={() => { setRole("tutor"); setError(""); }}><PawPrint /> Sou tutor</button>
            <button className={role === "professional" ? "is-active" : ""} type="button" role="tab" aria-selected={role === "professional"} onClick={() => { setRole("professional"); setError(""); }}><BriefcaseMedical /> Sou profissional</button>
          </div>

          {role === "tutor" ? (
            <>
              <label className="zoop-auth-field"><span>Nome</span><div><User /><input name="nome" type="text" placeholder="Seu nome completo" autoComplete="name" required /></div></label>
              <label className="zoop-auth-field"><span>E-mail</span><div><Mail /><input name="email" type="email" placeholder="seuemail@exemplo.com" autoComplete="email" required /></div></label>
              <label className="zoop-auth-field"><span>Senha</span><div><LockKeyhole /><input name="senha" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={6} required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
              <label className="zoop-auth-field"><span>Confirmar senha</span><div><LockKeyhole /><input name="confirmar" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={6} required /></div></label>
              {error && <p className="zoop-auth-error" role="alert">{error}</p>}
              <button className={`zoop-primary-button zoop-login-submit ${loading ? "is-loading" : ""}`} type="submit" disabled={loading}><span>{loading ? "Criando conta..." : "Criar conta"}</span><i /></button>
            </>
          ) : (
            <div style={{ marginTop: 6, padding: 16, background: "#f6f8f4", border: "1px solid var(--zoop-border)", borderRadius: 12, display: "grid", gap: 10 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 700, color: "var(--zoop-ink)", fontSize: ".85rem" }}>
                <Mailbox size={18} /> Cadastro de prestadores é feito pela nossa equipe
              </span>
              <p style={{ margin: 0, fontSize: ".78rem", color: "var(--zoop-muted)", lineHeight: 1.55 }}>
                Pra garantir a qualidade da rede Zoop, novas clínicas e profissionais são cadastrados diretamente pela nossa equipe, não por autoatendimento. Se você é um profissional ou clínica e quer fazer parte da Zoop, entre em contato com a gente que a equipe finaliza seu cadastro.
              </p>
            </div>
          )}

          <div className="zoop-login-divider"><span>ou</span></div>
          <p className="zoop-create-account">Já tenho conta <Link href="/entrar" style={{ color: "#4e951f", fontWeight: 750, textDecoration: "none" }}>Entrar</Link></p>
          <small><ShieldCheck /> Seus dados são protegidos por criptografia.</small>
        </form>
      </section>
    </main>
  );
}
