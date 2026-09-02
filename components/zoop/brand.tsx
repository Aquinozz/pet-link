import Image from "next/image";
import Link from "next/link";

type ZoopLogoProps = {
  href?: string;
  compact?: boolean;
  className?: string;
};

export function ZoopLogo({ href = "/", compact = false, className = "" }: ZoopLogoProps) {
  return (
    <Link
      className={`zoop-brand ${compact ? "zoop-brand--compact" : ""} ${className}`.trim()}
      href={href}
      aria-label="Zoop — página inicial"
    >
      <span className="zoop-brand__crop" aria-hidden="true">
        <Image src="/zoop-logo-source.png" alt="" width={783} height={453} priority />
      </span>
      <span className="sr-only">Zoop</span>
    </Link>
  );
}
