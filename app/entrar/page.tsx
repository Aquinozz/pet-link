"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BriefcaseMedical, Eye, EyeOff, LockKeyhole, Mail, PawPrint, ShieldCheck } from "lucide-react";

import { ZoopLogo } from "@/components/zoop/brand";
import { authService } from "@/lib/services";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { signIn, setTutorId, setPrestadorId, setNome, setFotoUrl } = useAuth();
  const [role, setRole] = useState<"tutor" | "professional">("tutor");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const senha = String(form.get("senha") ?? "");
    try {
      const { token } = await authService.login({ email, senha });
      signIn(token);
      const me = await authService.me();
      if (me.role === "ROLE_PROFISSIONAL" || me.role === "ROLE_ADMIN") {
        if (me.prestadorModelId) setPrestadorId(me.prestadorModelId);
        setNome(me.nome);
        setFotoUrl(me.fotoUrl ?? null);
        router.push("/profissional");
      } else {
        setTutorId(me.id);
        setNome(me.nome);
        setFotoUrl(me.fotoUrl ?? null);
        router.push("/tutor");
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(message ?? "Não foi possível entrar. Verifique suas credenciais.");
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
          <p>Uma experiência simples e segura para tutores e profissionais.</p>
          <div><span><ShieldCheck /> Profissionais verificados</span><span><PawPrint /> Tudo sobre seu pet em um só lugar</span></div>
        </div>
        <div className="zoop-login-pets" role="img" aria-label="Golden Retriever e gato da Zoop" />
      </section>

      <section className="zoop-login-form-wrap">
        <form className="zoop-login-card" onSubmit={submit}>
          <span className="zoop-eyebrow">Acesso seguro</span>
          <h2>Entrar na Zoop</h2>
          <p>Acesse sua conta para cuidar de quem você ama.</p>
          <div className="zoop-role-selector" role="tablist" aria-label="Tipo de conta">
            <button className={role === "tutor" ? "is-active" : ""} type="button" role="tab" aria-selected={role === "tutor"} onClick={() => setRole("tutor")}><PawPrint /> Sou tutor</button>
            <button className={role === "professional" ? "is-active" : ""} type="button" role="tab" aria-selected={role === "professional"} onClick={() => setRole("professional")}><BriefcaseMedical /> Sou profissional</button>
          </div>
          <label className="zoop-auth-field"><span>E-mail</span><div><Mail /><input name="email" type="email" placeholder="seuemail@exemplo.com" defaultValue={role === "tutor" ? "bianca@email.com" : "drcarlos@vet.com"} autoComplete="email" required /></div></label>
          <label className="zoop-auth-field"><span>Senha</span><div><LockKeyhole /><input name="senha" type={showPassword ? "text" : "password"} defaultValue="123456" autoComplete="current-password" required /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>
          <div className="zoop-login-help"><label><input type="checkbox" defaultChecked /> Manter conectado</label><button type="button">Esqueci minha senha</button></div>
          {error && <p className="zoop-auth-error" role="alert">{error}</p>}
          <button className={`zoop-primary-button zoop-login-submit ${loading ? "is-loading" : ""}`} type="submit" disabled={loading}><span>{loading ? "Entrando..." : "Entrar"}</span><i /></button>
          <div className="zoop-login-divider"><span>ou</span></div>
          <p className="zoop-create-account">Ainda não tenho conta <Link href="/cadastro" style={{ color: "#4e951f", fontWeight: 750, textDecoration: "none" }}>Criar conta</Link></p>
          <div style={{ marginTop: 16, padding: 12, background: "var(--zoop-bg-muted, #f6f8f4)", border: "1px solid var(--zoop-border)", borderRadius: 10 }}>
            <p style={{ margin: "0 0 4px", fontSize: ".68rem", fontWeight: 700, color: "var(--zoop-muted)" }}>Credenciais de teste</p>
            <p style={{ margin: 0, fontSize: ".68rem", color: "var(--zoop-muted)" }}>Tutor: bianca@email.com / 123456</p>
            <p style={{ margin: "2px 0 0", fontSize: ".68rem", color: "var(--zoop-muted)" }}>Prestador: clinica@petfeliz.com / 123456</p>
          </div>
          <small><ShieldCheck /> Seus dados são protegidos por criptografia.</small>
        </form>
      </section>
    </main>
  );
}
