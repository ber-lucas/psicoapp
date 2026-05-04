"use client";

import { useEffect, useState, useTransition } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { EmotionLog } from "@prisma/client";
import { Mail } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { EmotionCalendar } from "@/components/emotion/EmotionCalendar";
import { EMOTION_COLORS, type Emotion } from "@/lib/emotions";
import { cn } from "@/lib/utils";
import { getPatientEmotionLogs, type PatientWithLatestLog } from "@/lib/actions/emotion";

/**
 * Dialog que mostra o detalhe de um paciente — perfil + calendário com
 * os logs do paciente — carregado preguiçosamente ao abrir.
 *
 * O carregamento dos logs é deferido até o `patient` mudar para um valor
 * não nulo, evitando buscar dados de pacientes que o usuário nunca abriu.
 *
 * @param patient - Paciente alvo (ou `null` para fechar).
 * @param onClose - Callback chamado quando o usuário fecha o dialog.
 */
export function PatientDetailDialog({
  patient,
  onClose,
}: {
  patient: PatientWithLatestLog | null;
  onClose: () => void;
}) {
  const [logs, setLogs] = useState<EmotionLog[] | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!patient) {
      setLogs(null);
      return;
    }
    startTransition(async () => {
      const data = await getPatientEmotionLogs(patient.id);
      setLogs(data);
    });
  }, [patient]);

  const open = patient !== null;
  const latest = patient?.emotionLogs[0];

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">
            Detalhes do paciente {patient?.name ?? ""}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Histórico de emoções e contato do paciente.
          </DialogDescription>
        </DialogHeader>

        {patient && (
          <div className="flex flex-col gap-5">
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary/10 text-base text-primary">
                  {getInitials(patient.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-heading text-lg font-semibold text-foreground">
                  {patient.name}
                </span>
                <span className="flex items-center gap-1.5 truncate text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  {patient.email}
                </span>
              </div>
              {latest && (
                <span
                  className={cn(
                    "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                    EMOTION_COLORS[latest.emotion as Emotion] ??
                      "bg-muted text-muted-foreground border-border",
                  )}
                >
                  {latest.emotion}
                </span>
              )}
            </div>

            {latest && (
              <div className="rounded-2xl bg-muted/50 p-4">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Último registro
                </span>
                <p className="mt-1 text-sm text-foreground">
                  {format(
                    new Date(latest.createdAt),
                    "d 'de' MMMM 'de' yyyy 'às' HH:mm",
                    { locale: ptBR },
                  )}
                </p>
                {latest.notes && (
                  <p className="mt-2 whitespace-pre-wrap text-sm text-foreground/90">
                    {latest.notes}
                  </p>
                )}
              </div>
            )}

            <div>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Histórico
              </span>
              <div className="mt-2">
                {isPending || logs === null ? (
                  <Skeleton className="h-[300px] w-full rounded-2xl" />
                ) : logs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
                    Esse paciente ainda não registrou emoções.
                  </div>
                ) : (
                  <EmotionCalendar
                    logs={logs}
                    patientName={patient.name}
                  />
                )}
              </div>
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
