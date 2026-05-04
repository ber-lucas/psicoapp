import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EMOTION_COLORS, type Emotion } from "@/lib/emotions";
import { cn } from "@/lib/utils";
import type { EmotionLogWithUser } from "@/lib/actions/emotion";

type EmotionFeedProps = {
  logs: EmotionLogWithUser[];
};

/**
 * Timeline cronológica reversa dos últimos registros de emoção dos pacientes
 * vinculados ao psicólogo logado.
 *
 * Server Component puro — não há interatividade. O psicólogo escaneia rapidamente
 * o "humor coletivo" da semana através de badges padronizados por emoção.
 *
 * @param logs - Registros já ordenados por `createdAt desc` vindos de `getGlobalEmotionFeed`.
 * @returns Lista de cards, cada um representando um registro com paciente, badge,
 *   tempo relativo e prévia das anotações.
 */
export function EmotionFeed({ logs }: EmotionFeedProps) {
  if (logs.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Nenhum paciente registrou emoções ainda.
        </CardContent>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {logs.map((log) => (
        <li key={log.id}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                <span className="font-medium">{log.user.name}</span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    EMOTION_COLORS[log.emotion as Emotion] ??
                      "bg-gray-100 text-gray-800 border-gray-200",
                  )}
                >
                  {log.emotion}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(log.createdAt), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
              {log.notes && (
                <p className="text-sm text-foreground line-clamp-3 whitespace-pre-wrap">
                  {log.notes}
                </p>
              )}
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}
