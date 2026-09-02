"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { Check, PawPrint } from "lucide-react";

export function PageIntro({
  eyebrow,
  title,
  accent,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="zoop-page-intro zoop-reveal">
      <div>
        {eyebrow && <span className="zoop-eyebrow">{eyebrow}</span>}
        <h1>
          {title} {accent && <strong>{accent}</strong>}
        </h1>
        <p>{description}</p>
      </div>
      {action && <div className="zoop-page-intro__action">{action}</div>}
    </header>
  );
}

export function StatusPill({
  children,
  tone = "success",
}: {
  children: ReactNode;
  tone?: "success" | "warning" | "info" | "neutral";
}) {
  return <span className={`zoop-status zoop-status--${tone}`}>{children}</span>;
}

export function PersonAvatar({
  initials,
  name,
  tone = "green",
  size = "md",
}: {
  initials: string;
  name: string;
  tone?: "green" | "gold" | "teal" | "rose";
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span className={`zoop-avatar zoop-avatar--${tone} zoop-avatar--${size}`} role="img" aria-label={name}>
      {initials}
    </span>
  );
}

export function PetAvatar({ size = "md", className = "" }: { size?: "sm" | "md" | "lg" | "hero"; className?: string }) {
  return (
    <span className={`zoop-pet-avatar zoop-pet-avatar--${size} ${className}`.trim()} role="img" aria-label="Luna, uma Golden Retriever">
      <span />
    </span>
  );
}

export function AnimatedNumber({
  value,
  suffix = "",
  duration = 900,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      const reducedFrame = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(reducedFrame);
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, value]);

  return <>{display.toLocaleString("pt-BR")}{suffix}</>;
}

export function TiltCard({
  children,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = element.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    element.style.setProperty("--tilt-x", `${(-y * 4).toFixed(2)}deg`);
    element.style.setProperty("--tilt-y", `${(x * 5).toFixed(2)}deg`);
    element.style.setProperty("--glow-x", `${((x + 0.5) * 100).toFixed(0)}%`);
    element.style.setProperty("--glow-y", `${((y + 0.5) * 100).toFixed(0)}%`);
  }

  function reset() {
    ref.current?.style.removeProperty("--tilt-x");
    ref.current?.style.removeProperty("--tilt-y");
  }

  return (
    <div
      ref={ref}
      className={`zoop-tilt-card ${className}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      {...props}
    >
      {children}
    </div>
  );
}

export function IconBadge({ children }: { children: ReactNode }) {
  return <span className="zoop-icon-badge">{children}</span>;
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="zoop-empty-state">
      <span><PawPrint /></span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export function SuccessMark({ label = "Concluído" }: { label?: string }) {
  return (
    <span className="zoop-success-mark" aria-label={label}>
      <Check />
    </span>
  );
}

export function Bar({ value, color = "green" }: { value: number; color?: "green" | "soft" | "gold" }) {
  return (
    <span className="zoop-bar" aria-label={`${value}%`}>
      <span className={`zoop-bar__fill zoop-bar__fill--${color}`} style={{ "--bar-value": `${value}%` } as CSSProperties} />
    </span>
  );
}
