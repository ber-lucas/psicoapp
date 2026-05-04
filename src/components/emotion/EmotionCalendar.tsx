"use client";

import { useMemo, useState } from "react";
import type { EmotionLog, User } from "@prisma/client";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EMOTION_COLORS, type Emotion } from "@/lib/emotions";
import { cn } from "@/lib/utils";

/**
 * Log de emoção possivelmente acompanhado do paciente — quando o calendário
 * é usado pelo psicólogo no Feed Global, exibimos o nome do paciente nos
 * detalhes do dia. No dashboard do paciente, a relação fica ausente.
 */
export type EmotionLogWithMaybeUser = EmotionLog & { user?: User };

type EmotionCalendarProps = {
  logs: EmotionLogWithMaybeUser[];
  /**
   * Quando definido, sobrescreve o nome exibido no Dialog (útil na página
   * individual do paciente vista pelo psicólogo). Caso contrário, usa o
   * `log.user?.name` quando presente.
   */
  patientName?: string;
};

/**
 * Calendário que destaca os dias em que há registros de emoção e abre um
 * Dialog com os detalhes ao clicar no dia.
 *
 * Reutilizado em três contextos: dashboard do paciente, aba "Calendário Global"
 * do psicólogo e página individual de cada paciente — daí a flexibilidade
 * de receber `logs` com ou sem `user` populado.
 *
 * @param logs - Registros de emoção a serem mapeados no calendário.
 * @param patientName - Nome a ser fixado no cabeçalho do Dialog quando o calendário
 *   representa um único paciente (visão do psicólogo). Ignorado no feed global,
 *   onde cada log já carrega seu próprio `user`.
 */
export function EmotionCalendar({ logs, patientName }: EmotionCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);

  const daysWithLogs = useMemo(
    () => logs.map((log) => new Date(log.createdAt)),
    [logs],
  );

  const logsForSelectedDay = useMemo(() => {
    if (!selectedDay) return [];
    return logs.filter((log) =>
      isSameDay(new Date(log.createdAt), selectedDay),
    );
  }, [logs, selectedDay]);

  const handleSelect = (day: Date | undefined) => {
    if (!day) return;
    const hasLogsOnDay = logs.some((log) =>
      isSameDay(new Date(log.createdAt), day),
    );
    if (!hasLogsOnDay) return;

    setSelectedDay(day);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDay}
          onSelect={handleSelect}
          locale={ptBR}
          modifiers={{ hasLog: daysWithLogs }}
          modifiersClassNames={{
            hasLog:
              "relative font-semibold after:content-[''] after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-1 after:w-1 after:rounded-full after:bg-primary",
          }}
          className="rounded-md border"
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Registros de{" "}
              {selectedDay ? format(selectedDay, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : ""}
            </DialogTitle>
            <DialogDescription>
              {logsForSelectedDay.length === 1
                ? "1 registro neste dia."
                : `${logsForSelectedDay.length} registros neste dia.`}
            </DialogDescription>
          </DialogHeader>

          <ul className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {logsForSelectedDay.map((log) => {
              const displayedName = patientName ?? log.user?.name;
              return (
                <li
                  key={log.id}
                  className="rounded-md border bg-card p-3 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        EMOTION_COLORS[log.emotion as Emotion] ??
                          "bg-gray-100 text-gray-800 border-gray-200",
                      )}
                    >
                      {log.emotion}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(log.createdAt), "HH:mm")}
                    </span>
                  </div>
                  {displayedName && (
                    <p className="text-xs font-medium text-muted-foreground">
                      {displayedName}
                    </p>
                  )}
                  {log.notes && (
                    <p className="text-sm whitespace-pre-wrap">{log.notes}</p>
                  )}
                </li>
              );
            })}
          </ul>
        </DialogContent>
      </Dialog>
    </>
  );
}
