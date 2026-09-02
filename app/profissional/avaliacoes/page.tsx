"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Send, Star, Users } from "lucide-react";

import { useZoopNotice } from "@/components/zoop/app-shell";
import { Bar, IconBadge, PageIntro, PersonAvatar, StatusPill, TiltCard } from "@/components/zoop/ui";
import { reviewService } from "@/lib/services";
import type { ReviewResponseDto } from "@/lib/types";

function initialsOf(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

export default function ReviewsPage() {
  const notice = useZoopNotice();
  const [reviews, setReviews] = useState<ReviewResponseDto[]>([]);
  const [filter, setFilter] = useState("Todas");
  const [replied, setReplied] = useState<Record<number, boolean>>({});

  useEffect(() => {
    reviewService.listar().then(setReviews).catch(() => setReviews([]));
  }, []);

  const visible = useMemo(() => reviews.filter((review) => {
    if (filter === "Com comentário") return !!review.comentario?.trim();
    return true;
  }), [filter, reviews]);

  const average = useMemo(() => {
    if (!reviews.length) return null;
    return reviews.reduce((sum, review) => sum + review.nota, 0) / reviews.length;
  }, [reviews]);

  const distribution = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((review) => {
      const index = Math.min(4, Math.max(0, review.nota - 1));
      counts[index] += 1;
    });
    const max = Math.max(1, ...counts);
    return counts.map((count, index) => ({ stars: index + 1, count, value: count ? Math.round((count / max) * 100) : 0 }));
  }, [reviews]);

  return (
    <div className="zoop-page zoop-stagger">
      <PageIntro title="Avaliações" description="Acompanhe sua reputação, comentários e responda seus clientes." />
      <section className="zoop-review-metrics zoop-reveal">
        <TiltCard className="zoop-panel zoop-rating-summary"><IconBadge><Star /></IconBadge><div><span>Sua reputação na Zoop</span><strong>{average != null ? average.toFixed(1).replace(".", ",") : "—"}</strong><p className="zoop-stars">{"★".repeat(average != null ? Math.round(average) : 0) || "☆☆☆☆☆"}</p><small>{reviews.length} avaliações</small><StatusPill>Reputação sincronizada</StatusPill></div></TiltCard>
        <TiltCard className="zoop-panel zoop-rating-distribution"><h2>Distribuição das avaliações</h2>{distribution.slice().reverse().map(({ stars, count, value }) => <div key={stars}><span>{stars} estrelas</span><Bar value={value} color={stars === 5 ? "green" : "soft"} /><strong>{count}</strong></div>)}</TiltCard>
        <TiltCard className="zoop-panel zoop-rating-chart"><h2>Evolução da nota</h2><div className="zoop-line-chart" aria-label="Média geral das avaliações"><div className="zoop-chart-caption"><strong>{average != null ? average.toFixed(1).replace(".", ",") : "—"}</strong><span>média em todas as avaliações</span></div></div></TiltCard>
      </section>

      <div className="zoop-review-toolbar zoop-reveal"><div className="zoop-tabs">{["Todas", "Com comentário", "Aguardando resposta"].map((item) => <button className={filter === item ? "is-active" : ""} type="button" onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><select aria-label="Ordenar avaliações"><option>Mais recentes</option><option>Melhor nota</option></select></div>

      <div className="zoop-reviews-layout">
        <section className="zoop-review-list zoop-reveal">
          {visible.map((review, index) => (
            <article className="zoop-panel zoop-review-card" key={review.id}>
              <PersonAvatar initials={initialsOf(review.tutorNome)} name={review.tutorNome} tone={index % 2 ? "gold" : "rose"} size="lg" />
              <div className="zoop-review-card__copy"><h2>{review.tutorNome} • {review.prestadorNome}</h2><p>Nota {review.nota} • {new Date(review.dataCriacao).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}</p><span className="zoop-stars">{"★".repeat(review.nota)}</span><blockquote>{review.comentario || "Sem comentário escrito."}</blockquote><div className="zoop-reply-field"><PersonAvatar initials="AS" name="Resposta" tone="teal" size="sm" /><input aria-label="Responder avaliação" placeholder="Responder avaliação..." /><button type="button" onClick={() => { setReplied((current) => ({ ...current, [review.id]: true })); notice("Resposta publicada com sucesso."); }}><Send /> Responder avaliação</button></div></div>
              <StatusPill tone={replied[review.id] ? "success" : "warning"}>{replied[review.id] ? "Resposta publicada" : "Aguardando resposta"}</StatusPill>
            </article>
          ))}
          {!visible.length && <div className="zoop-empty-state zoop-reveal"><h3>Nenhuma avaliação ainda</h3><p>As avaliações dos seus clientes aparecerão aqui.</p></div>}
        </section>
        <aside className="zoop-panel zoop-review-insights zoop-reveal"><h2>Insights</h2><div><IconBadge><Users /></IconBadge><span><strong>{reviews.length}</strong><p>avaliações recebidas</p></span></div><div><IconBadge><Star /></IconBadge><span><strong>{average != null ? average.toFixed(1).replace(".", ",") : "—"}</strong><p>nota média geral</p></span></div><div><IconBadge><MessageCircle /></IconBadge><span><strong>{visible.filter((review) => review.comentario?.trim()).length}</strong><p>avaliações com comentário</p></span></div><p><MessageCircle /> Responder rápido melhora sua reputação.</p></aside>
      </div>
    </div>
  );
}