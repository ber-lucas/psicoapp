import type { Role } from "@prisma/client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

/**
 * Wrapper de layout para todas as páginas autenticadas.
 *
 * Aplica a Sidebar fixa em desktop e a TopBar (que entrega o hamburger
 * em mobile e o menu de usuário em todas as larguras). O `title` /
 * `subtitle` são consumidos pelo `TopBar` e devem ser passados pela
 * página atual.
 *
 * Como Server Component, recebe os dados do usuário/role já hidratados
 * do Prisma — quem cuida da autorização é o layout pai (`requireRole`),
 * mantendo este componente puro de UI.
 *
 * @param title - Título principal da página, exibido no `TopBar`.
 * @param subtitle - Subtítulo opcional do `TopBar`.
 * @param role - Papel do usuário, repassado para Sidebar/MobileSidebar.
 * @param userName - Nome do usuário autenticado.
 * @param userEmail - Email do usuário autenticado.
 * @param children - Conteúdo da página renderizado dentro do `<main>`.
 */
export function AppShell({
  title,
  subtitle,
  role,
  userName,
  userEmail,
  children,
}: {
  title: string;
  subtitle?: string;
  role: Role;
  userName: string;
  userEmail: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar role={role} userName={userName} userEmail={userEmail} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          title={title}
          subtitle={subtitle}
          role={role}
          userName={userName}
          userEmail={userEmail}
        />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
