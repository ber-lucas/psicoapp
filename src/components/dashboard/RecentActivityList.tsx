import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EMOTION_COLORS, type Emotion } from "@/lib/emotions";
import { cn } from "@/lib/utils";
import type { EmotionLogWithUser } from "@/lib/actions/emotion";

/**
 * Lista compacta de atividades recentes dos pacientes — adaptação da
 * tabela "Work with clients" da inspiração para o domínio do app.
 *
 * Cada linha tem avatar do paciente, nome, badge da emoção registrada
 * e a hora/data formatada. Usado no dashboard do psicólogo para dar
 * uma "régua de pulso" do dia/semana sem precisar abrir o histórico.
 *
 * @param logs - Logs de emoção mais recentes com paciente embutido.
 */
export function RecentActivityList({ logs }: { logs: EmotionLogWithUser[] }) {
  if (logs.length === 0) {
    return (
      <div className="rounded-3xl border border-border/60 bg-card p-6 text-center text-sm text-muted-foreground shadow-sm">
        Ainda não há atividade dos seus pacientes.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Atividade recente
        </h3>
        <span className="text-xs text-muted-foreground">
          Últimos {logs.length} registros
        </span>
      </div>
      <ul className="divide-y divide-border/60">
        {logs.map((log) => (
          <li
            key={log.id}
            className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-muted/40"
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary">
                {getInitials(log.user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium text-foreground">
                {log.user.name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {format(new Date(log.createdAt), "d 'de' MMM • HH:mm", {
                  locale: ptBR,
                })}
              </span>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                EMOTION_COLORS[log.emotion as Emotion] ??
                  "bg-muted text-muted-foreground border-border",
              )}
            >
              {log.emotion}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}
