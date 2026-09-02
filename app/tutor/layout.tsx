import type { ReactNode } from "react";

import { AppShell } from "@/components/zoop/app-shell";

export default function TutorLayout({ children }: { children: ReactNode }) {
  return <AppShell role="tutor">{children}</AppShell>;
}

