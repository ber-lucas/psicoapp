"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EMOTION_COLORS, type Emotion } from "@/lib/emotions";
import { cn } from "@/lib/utils";
import type { EmotionLogMaybeUser } from "./EmotionFeedItem";

/**
 * Dialog que mostra um único registro de emoção em formato expandido.
 *
 * Reutilizado tanto no histórico do psicólogo (`/psychologist/history`)
 * quanto no diário do paciente — `showUser` controla se o nome do
 * paciente aparece (psicólogo) ou se é omitido (paciente vendo a si).
 *
 * @param log - Registro a ser exibido (ou `null` para fechar).
 * @param onClose - Callback ao fechar o dialog.
 * @param showUser - Quando `true`, exibe nome do paciente (default).
 */
export function EmotionDetailDialog({
  log,
  onClose,
  showUser = true,
}: {
  log: EmotionLogMaybeUser | null;
  onClose: () => void;
  showUser?: boolean;
}) {
  const open = log !== null;
  const userName = showUser ? log?.user?.name : undefined;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">
            Registro de emoção {log ? `de ${userName ?? "você"}` : ""}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Detalhes do registro: emoção, data e anotações.
          </DialogDescription>
        </DialogHeader>

        {log && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {userName && (
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex min-w-0 flex-col">
                  <span className="font-heading text-base font-semibold text-foreground">
                    {userName ?? "Seu registro"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(
                      new Date(log.createdAt),
                      "d 'de' MMMM 'de' yyyy 'às' HH:mm",
                      { locale: ptBR },
                    )}
                  </span>
                </div>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1 text-sm font-medium",
                  EMOTION_COLORS[log.emotion as Emotion] ??
                    "bg-muted text-muted-foreground border-border",
                )}
              >
                {log.emotion}
              </span>
            </div>

            <div className="rounded-2xl bg-muted/40 p-4">
              {log.notes ? (
                <p className="whitespace-pre-wrap text-sm text-foreground/90">
                  {log.notes}
                </p>
              ) : (
                <p className="text-sm italic text-muted-foreground">
                  Sem anotações neste registro.
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}
