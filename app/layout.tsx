import type { Metadata } from "next";
import "./globals.css";
import "./experience.css";
import { AuthProvider } from "@/lib/auth";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Zoop — Conectando quem ama, com quem cuida",
  description:
    "Serviços e profissionais para cuidar do seu pet em um só lugar.",
  other: {
    "codex-preview": "development",
    "theme-color": "#002724",
  },
  openGraph: {
    title: "Zoop — Conectando quem ama, com quem cuida",
    description: "Serviços e profissionais para o seu pet.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Zoop" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Zoop — Conectando quem ama, com quem cuida",
    description: "Serviços e profissionais para o seu pet.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
