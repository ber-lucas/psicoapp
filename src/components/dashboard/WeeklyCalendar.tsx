"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import {
  addDays,
  addWeeks,
  format,
  isSameDay,
  isToday,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmotionFeedItem, type EmotionLogMaybeUser } from "@/components/emotion/EmotionFeedItem";
import { cn } from "@/lib/utils";

const WEEKDAY_LABELS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

/**
 * Faixa horizontal de 7 dias da semana atual com seleção por clique.
 *
 * Ao clicar em um dia, abre um Dialog listando todos os registros de
 * emoção daquele dia. Para o paciente (`showUser=false`) exibe os seus
 * próprios registros; para o psicólogo (`showUser=true`) exibe os dos
 * pacientes vinculados.
 *
 * @param logs - Registros de emoção usados para destacar dias com atividade
 *   e popular o Dialog. Aceita logs com ou sem `user` embutido.
 * @param showUser - Quando `true`, exibe o nome do paciente nos itens do Dialog.
 * @param initialDate - Data inicial selecionada (default: hoje).
 */
export function WeeklyCalendar({
  logs,
  showUser = false,
  initialDate,
}: {
  logs: EmotionLogMaybeUser[];
  showUser?: boolean;
  initialDate?: Date;
}) {
  const [anchor, setAnchor] = useState<Date>(initialDate ?? new Date());
  const [selected, setSelected] = useState<Date>(initialDate ?? new Date());
  const [dialogDate, setDialogDate] = useState<Date | null>(null);

  const weekStart = useMemo(
    () => startOfWeek(anchor, { weekStartsOn: 1 }),
    [anchor],
  );

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart],
  );

  const daysWithLogs = useMemo(() => {
    const set = new Set<string>();
    for (const log of logs) {
      const d =
        log.createdAt instanceof Date ? log.createdAt : new Date(log.createdAt);
      set.add(format(d, "yyyy-MM-dd"));
    }
    return set;
  }, [logs]);

  const dialogLogs = useMemo(() => {
    if (!dialogDate) return [];
    return logs.filter((log) => {
      const d =
        log.createdAt instanceof Date ? log.createdAt : new Date(log.createdAt);
      return isSameDay(d, dialogDate);
    });
  }, [logs, dialogDate]);

  const monthLabel = format(weekStart, "MMMM yyyy", { locale: ptBR });

  const dialogTitle = dialogDate
    ? format(dialogDate, "EEEE, d 'de' MMMM", { locale: ptBR })
    : "";

  return (
    <>
      <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Calendário
            </span>
            <span className="font-heading text-base font-semibold capitalize text-foreground">
              {monthLabel}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setAnchor(subWeeks(anchor, 1))}
              aria-label="Semana anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setAnchor(addWeeks(anchor, 1))}
              aria-label="Próxima semana"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 sm:overflow-visible">
          {days.map((day, idx) => {
            const isSelected = isSameDay(day, selected);
            const hasLog = daysWithLogs.has(format(day, "yyyy-MM-dd"));
            const today = isToday(day);

            return (
              <button
                key={day.toISOString()}
                type="button"
                onClick={() => {
                  setSelected(day);
                  setDialogDate(day);
                }}
                className={cn(
                  "flex min-w-[52px] flex-1 snap-start flex-col items-center gap-1 rounded-2xl px-2 py-3 text-sm transition-colors",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/40 text-foreground hover:bg-muted",
                )}
                aria-pressed={isSelected}
                aria-label={format(day, "EEEE, d 'de' MMMM", { locale: ptBR })}
              >
                <span
                  className={cn(
                    "text-[11px] font-medium uppercase tracking-wide",
                    isSelected
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground",
                  )}
                >
                  {WEEKDAY_LABELS[idx]}
                </span>
                <span className="font-heading text-lg font-semibold leading-none">
                  {format(day, "d")}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "h-1 w-1 rounded-full",
                    hasLog
                      ? isSelected
                        ? "bg-primary-foreground"
                        : "bg-primary"
                      : today && !isSelected
                        ? "bg-muted-foreground/40"
                        : "bg-transparent",
                  )}
                />
              </button>
            );
          })}
        </div>
      </div>

      <Dialog
        open={dialogDate !== null}
        onOpenChange={(next) => {
          if (!next) setDialogDate(null);
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading capitalize">
              {dialogTitle}
            </DialogTitle>
            <DialogDescription>
              {dialogLogs.length === 0
                ? "Nenhum registro neste dia."
                : dialogLogs.length === 1
                  ? "1 registro de emoção"
                  : `${dialogLogs.length} registros de emoção`}
            </DialogDescription>
          </DialogHeader>

          {dialogLogs.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
                <CalendarDays className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground">
                Nenhuma emoção foi registrada neste dia.
              </p>
            </div>
          ) : (
            <ScrollArea className="max-h-[60vh] pr-1">
              <div className="flex flex-col gap-3 py-1">
                {dialogLogs.map((log) => (
                  <EmotionFeedItem key={log.id} log={log} showUser={showUser} />
                ))}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
