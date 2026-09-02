import type { ReactNode } from "react";

import { AppShell } from "@/components/zoop/app-shell";

export default function ProfessionalLayout({ children }: { children: ReactNode }) {
  return <AppShell role="professional">{children}</AppShell>;
}

