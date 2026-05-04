import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { EmotionLog } from "@prisma/client";
import { Sparkles } from "lucide-react";

import { EMOTION_COLORS, type Emotion } from "@/lib/emotions";
import { cn } from "@/lib/utils";

/**
 * Card lateral do dashboard do paciente — destaca a última emoção
 * registrada com badge grande, data formatada e prévia das anotações.
 *
 * Substitui a "Client list" da inspiração com algo do domínio do paciente
 * (não faz sentido listar "clientes" para um paciente).
 *
 * @param log - Último registro do paciente, ou `null` quando ainda não postou.
 */
export function LastEmotionCard({ log }: { log: EmotionLog | null }) {
  if (!log) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card/60 p-6 text-center shadow-sm">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <p className="font-heading text-base font-semibold text-foreground">
          Pronto para começar?
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Vá até o Diário e registre como você está se sentindo agora.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Última emoção
      </span>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span
          className={cn(
            "rounded-full border px-3 py-1 text-sm font-medium",
            EMOTION_COLORS[log.emotion as Emotion] ??
              "bg-muted text-muted-foreground border-border",
          )}
        >
          {log.emotion}
        </span>
        <span className="text-xs text-muted-foreground">
          {format(new Date(log.createdAt), "d 'de' MMM • HH:mm", {
            locale: ptBR,
          })}
        </span>
      </div>
      {log.notes && (
        <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm text-foreground/90">
          {log.notes}
        </p>
      )}
    </div>
  );
}
