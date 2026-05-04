import type { Role } from "@prisma/client";
import { SidebarBody } from "./SidebarBody";

/**
 * Sidebar fixa do app (visível apenas em telas `md+`).
 *
 * Server Component — recebe os dados do usuário e do papel via props (já que
 * o `requireRole` roda no layout pai). Em telas pequenas dá lugar ao
 * `MobileSidebar`, acionado pelo botão hamburger no `TopBar`.
 *
 * @param role - Papel do usuário (PATIENT / PSYCHOLOGIST).
 * @param userName - Nome a exibir no rodapé.
 * @param userEmail - Email a exibir no rodapé.
 */
export function Sidebar({
  role,
  userName,
  userEmail,
}: {
  role: Role;
  userName: string;
  userEmail: string;
}) {
  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:sticky md:top-0 md:flex">
      <SidebarBody role={role} userName={userName} userEmail={userEmail} />
    </aside>
  );
}
