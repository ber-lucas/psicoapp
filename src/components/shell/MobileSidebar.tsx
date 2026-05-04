"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import type { Role } from "@prisma/client";

import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarBody } from "./SidebarBody";

/**
 * Versão mobile da sidebar — disparada por botão hamburger no `TopBar`.
 *
 * Reusa o mesmo `SidebarBody` da versão desktop dentro de um `Sheet` lateral.
 * Mantemos estado local (`open`) para podermos fechar automaticamente após
 * o usuário clicar em um item de navegação.
 *
 * @param role - Papel do usuário.
 * @param userName - Nome a exibir.
 * @param userEmail - Email a exibir.
 */
export function MobileSidebar({
  role,
  userName,
  userEmail,
}: {
  role: Role;
  userName: string;
  userEmail: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Abrir menu">
            <Menu className="h-5 w-5" />
          </Button>
        }
      />
      <SheetContent
        side="left"
        className="w-72 border-r-0 bg-sidebar p-0 text-sidebar-foreground sm:max-w-72"
      >
        <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
        <SheetDescription className="sr-only">
          Selecione uma das áreas do app.
        </SheetDescription>
        <SidebarBody
          role={role}
          userName={userName}
          userEmail={userEmail}
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
