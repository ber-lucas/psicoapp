"use client";

import { useTransition } from "react";
import { LogOut, ChevronDown } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/app/(auth)/login/actions";

/**
 * Avatar à direita do `TopBar` que abre um dropdown com nome/email
 * e a ação de sair.
 *
 * Cliente porque o dropdown precisa de estado e o "Sair" dispara a
 * Server Action `logout` via `useTransition` para feedback visual.
 *
 * @param userName - Nome a exibir como label e fonte das iniciais.
 * @param userEmail - Email a exibir como subtítulo.
 */
export function TopBarUserMenu({
  userName,
  userEmail,
}: {
  userName: string;
  userEmail: string;
}) {
  const [isPending, startTransition] = useTransition();
  const initials = getInitials(userName);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label={`Abrir menu de ${userName}`}
            className="flex items-center gap-2 rounded-full border border-transparent bg-card px-2 py-1.5 text-left transition-colors hover:border-border hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden flex-col leading-tight sm:flex">
              <span className="text-xs font-medium text-foreground">
                {userName}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {userEmail}
              </span>
            </span>
            <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-medium text-foreground">
                {userName}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {userEmail}
              </span>
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          disabled={isPending}
          onClick={() => startTransition(() => logout())}
        >
          <LogOut className="mr-1.5 h-4 w-4" />
          {isPending ? "Saindo…" : "Sair"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}
