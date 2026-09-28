import type { ReactNode } from "react";
import WorkspaceShell from "@/components/workspace-shell";
import { CareerProvider } from "@/lib/career-provider";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <CareerProvider><WorkspaceShell>{children}</WorkspaceShell></CareerProvider>;
}