"use client";

import { useState } from "react";

import { EmotionFeedItem, type EmotionLogMaybeUser } from "./EmotionFeedItem";
import { EmotionDetailDialog } from "./EmotionDetailDialog";

/**
 * Lista cronológica clicável de emoções — cada item abre o
 * `EmotionDetailDialog` com o registro expandido.
 *
 * Reutilizada no Histórico do psicólogo (com `showUser`) e no
 * Diário do paciente (sem `showUser`, ocultando o nome).
 *
 * @param logs - Logs ordenados por data (descendente).
 * @param showUser - Repassado a `EmotionFeedItem` e `EmotionDetailDialog`
 *   para alternar exibição do nome/avatar do paciente.
 * @param emptyMessage - Texto exibido quando `logs` está vazio.
 */
export function EmotionFeedFull({
  logs,
  showUser = true,
  emptyMessage = "Nenhum registro encontrado.",
}: {
  logs: EmotionLogMaybeUser[];
  showUser?: boolean;
  emptyMessage?: string;
}) {
  const [openLog, setOpenLog] = useState<EmotionLogMaybeUser | null>(null);

  if (logs.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card/50 px-6 py-12 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      <ul className="space-y-3">
        {logs.map((log) => (
          <li key={log.id}>
            <button
              type="button"
              onClick={() => setOpenLog(log)}
              className="block w-full rounded-2xl text-left transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <EmotionFeedItem log={log} showUser={showUser} />
            </button>
          </li>
        ))}
      </ul>

      <EmotionDetailDialog
        log={openLog}
        onClose={() => setOpenLog(null)}
        showUser={showUser}
      />
    </>
  );
}
