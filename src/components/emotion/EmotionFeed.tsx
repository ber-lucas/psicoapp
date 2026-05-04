import { EmotionFeedItem } from "./EmotionFeedItem";
import type { EmotionLogWithUser } from "@/lib/actions/emotion";

type EmotionFeedProps = {
  logs: EmotionLogWithUser[];
};

/**
 * Timeline cronológica reversa dos últimos registros de emoção.
 *
 * Server Component puro — não interativa. Delega a aparência de cada
 * item ao `EmotionFeedItem` para que o histórico clicável (Fase 4)
 * possa reusar o mesmo visual.
 *
 * @param logs - Registros já ordenados por `createdAt desc`.
 */
export function EmotionFeed({ logs }: EmotionFeedProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-muted-foreground">
        Nenhum paciente registrou emoções ainda.
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {logs.map((log) => (
        <li key={log.id}>
          <EmotionFeedItem log={log} />
        </li>
      ))}
    </ul>
  );
}
