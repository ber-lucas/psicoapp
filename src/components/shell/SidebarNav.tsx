"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_BY_ROLE } from "./nav-config";
import type { Role } from "@prisma/client";

/**
 * Lista de links da navegação principal com destaque do item ativo.
 *
 * Cliente porque depende de `usePathname()` para marcar o link atual.
 * Importa os itens de navegação internamente via {@link NAV_BY_ROLE} para
 * evitar passar ícones Lucide (funções) através do boundary Server→Client.
 *
 * @param role - Papel do usuário; seleciona o conjunto de itens correto.
 * @param onNavigate - Callback opcional disparado ao clicar (útil para fechar
 *   o Sheet em mobile após navegação).
 */
export function SidebarNav({
  role,
  onNavigate,
}: {
  role: Role;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const items = NAV_BY_ROLE[role];

  return (
    <nav className="flex flex-col gap-1.5">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                : "text-sidebar-foreground/85 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
            )}
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
