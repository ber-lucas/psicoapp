import {
  LayoutDashboard,
  Users,
  History,
  NotebookPen,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "@prisma/client";

/**
 * Item de navegação renderizado na sidebar do app.
 *
 * Mantemos como dado puro (não JSX) para permitir reuso em desktop
 * (sidebar fixa) e mobile (Sheet) sem duplicar declarações.
 */
export type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

/**
 * Mapa de itens de navegação por papel do usuário.
 *
 * Centraliza a topologia de navegação do app — qualquer mudança de rota
 * autenticada (renomear, adicionar) deve passar por aqui em vez de
 * editar cada Sidebar/Layout. As rotas refletem o route group `(app)`.
 */
export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  PSYCHOLOGIST: [
    { href: "/psychologist/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/psychologist/patients", label: "Pacientes", icon: Users },
    { href: "/psychologist/history", label: "Histórico", icon: History },
  ],
  PATIENT: [
    { href: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/patient/journal", label: "Diário", icon: NotebookPen },
  ],
};
