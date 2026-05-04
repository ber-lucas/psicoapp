import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { EmotionLog, User } from "@prisma/client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EMOTION_COLORS, type Emotion } from "@/lib/emotions";
import { cn } from "@/lib/utils";

/**
 * Log de emoção possivelmente acompanhado do paciente — `user` fica
 * opcional para permitir reuso do item em contextos do paciente
 * (diário pessoal não exibe nome) e do psicólogo (feed agregado exibe).
 */
export type EmotionLogMaybeUser = EmotionLog & { user?: User };

/**
 * Item visual reutilizado em todas as listas cronológicas de emoções:
 * feed do psicólogo, histórico completo e diário do paciente.
 *
 * Renderiza avatar (quando há paciente), badge da emoção, tempo relativo
 * e prévia das anotações (clamp de 3 linhas).
 *
 * @param log - Registro de emoção, com `user` opcional embutido.
 * @param showUser - Quando `true`, exibe avatar e nome (default).
 *   Defina `false` no diário do paciente para evitar redundância.
 */
export function EmotionFeedItem({
  log,
  showUser = true,
}: {
  log: EmotionLogMaybeUser;
  showUser?: boolean;
}) {
  const userName = showUser ? log.user?.name : undefined;
  const initials = userName ? getInitials(userName) : null;

  return (
    <article className="flex gap-3 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      {initials && (
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            {userName ?? "Você"}
          </span>
          <span
            className={cn(
              "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium",
              EMOTION_COLORS[log.emotion as Emotion] ??
                "bg-muted text-muted-foreground border-border",
            )}
          >
            {log.emotion}
          </span>
        </div>

        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(log.createdAt), {
            addSuffix: true,
            locale: ptBR,
          })}
        </span>

        {log.notes && (
          <p className="line-clamp-3 whitespace-pre-wrap text-sm text-foreground/90">
            {log.notes}
          </p>
        )}
      </div>
    </article>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}
