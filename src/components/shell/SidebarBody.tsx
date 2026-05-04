import { Brain } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./SidebarNav";
import type { Role } from "@prisma/client";

/**
 * Conteúdo interno compartilhado entre a Sidebar fixa (desktop) e o
 * Sheet (mobile). Renderiza logo, navegação por papel e bloco de usuário.
 *
 * Mantido como Server Component puro: SidebarNav (cliente) cuida de
 * destacar o item ativo a partir de `usePathname()`.
 *
 * @param role - Papel do usuário autenticado, usado para escolher o conjunto
 *   de itens via {@link NAV_BY_ROLE}.
 * @param userName - Nome completo do usuário, exibido no rodapé da sidebar.
 * @param userEmail - Email do usuário, exibido como subtítulo no rodapé.
 * @param onNavigate - Repassado a `SidebarNav` (callback opcional após clique).
 */
export function SidebarBody({
  role,
  userName,
  userEmail,
  onNavigate,
}: {
  role: Role;
  userName: string;
  userEmail: string;
  onNavigate?: () => void;
}) {
  const initials = getInitials(userName);

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      <div className="flex items-center gap-2.5 px-1">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sidebar-primary/15 text-sidebar-foreground">
          <Brain className="h-5 w-5" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-heading text-base font-semibold text-sidebar-foreground">
            PsicoApp
          </span>
          <span className="text-xs text-sidebar-foreground/65">
            {role === "PSYCHOLOGIST" ? "Psicólogo" : "Paciente"}
          </span>
        </div>
      </div>

      <Separator className="bg-sidebar-border" />

      <SidebarNav role={role} onNavigate={onNavigate} />

      <div className="mt-auto">
        <Separator className="mb-4 bg-sidebar-border" />
        <div className="flex items-center gap-3 px-1">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-col leading-tight">
            <span className="truncate text-sm font-medium text-sidebar-foreground">
              {userName}
            </span>
            <span className="truncate text-xs text-sidebar-foreground/65">
              {userEmail}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Extrai até duas iniciais a partir do nome para preencher o `AvatarFallback`.
 *
 * @param name - Nome completo do usuário.
 * @returns String em maiúsculas com 1 ou 2 letras (ex: "Bernardo" → "B",
 *   "João Silva" → "JS"). Retorna "?" se o nome estiver vazio.
 */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}
