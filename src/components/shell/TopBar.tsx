import type { Role } from "@prisma/client";

import { MobileSidebar } from "./MobileSidebar";
import { TopBarUserMenu } from "./TopBarUserMenu";

/**
 * Barra superior do app autenticado.
 *
 * Em telas pequenas mostra o botão hamburger (`MobileSidebar`); em todas as
 * telas mostra título da página e o `TopBarUserMenu` à direita.
 *
 * @param title - Título da página atual (psicólogo/paciente passa via prop).
 * @param subtitle - Subtítulo opcional (ex: descrição curta da rota).
 * @param role - Papel do usuário (necessário para o `MobileSidebar`).
 * @param userName - Nome a exibir no menu do canto direito.
 * @param userEmail - Email a exibir no menu do canto direito.
 */
export function TopBar({
  title,
  subtitle,
  role,
  userName,
  userEmail,
}: {
  title: string;
  subtitle?: string;
  role: Role;
  userName: string;
  userEmail: string;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur md:px-8">
      <MobileSidebar role={role} userName={userName} userEmail={userEmail} />

      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="font-heading truncate text-lg font-semibold text-foreground md:text-xl">
          {title}
        </h1>
        {subtitle && (
          <p className="truncate text-xs text-muted-foreground md:text-sm">
            {subtitle}
          </p>
        )}
      </div>

      <TopBarUserMenu userName={userName} userEmail={userEmail} />
    </header>
  );
}
