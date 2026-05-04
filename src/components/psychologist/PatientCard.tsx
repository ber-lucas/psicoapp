"use client";

import { Mail, ChevronRight } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EMOTION_COLORS, type Emotion } from "@/lib/emotions";
import { cn } from "@/lib/utils";
import type { PatientWithLatestLog } from "@/lib/actions/emotion";

/**
 * Cartão clicável de um paciente vinculado.
 *
 * Cliente porque dispara `onOpen` para abrir o `PatientDetailDialog` no pai.
 * Mostra avatar, nome, email e a última emoção registrada (ou "Sem registros"
 * quando o paciente nunca postou).
 *
 * @param patient - Paciente com seu último `EmotionLog` embutido.
 * @param onOpen - Callback acionado ao clicar — recebe o `id` do paciente.
 */
export function PatientCard({
  patient,
  onOpen,
}: {
  patient: PatientWithLatestLog;
  onOpen: (patientId: string) => void;
}) {
  const latest = patient.emotionLogs[0];
  const initials = getInitials(patient.name);

  return (
    <button
      type="button"
      onClick={() => onOpen(patient.id)}
      className="group flex w-full items-center gap-4 rounded-3xl border border-border/60 bg-card p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Avatar className="h-14 w-14 shrink-0">
        <AvatarFallback className="bg-primary/10 text-base text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-base font-semibold text-foreground">
          {patient.name}
        </span>
        <span className="flex items-center gap-1 truncate text-xs text-muted-foreground">
          <Mail className="h-3 w-3 shrink-0" />
          {patient.email}
        </span>
        <div className="mt-1">
          {latest ? (
            <span
              className={cn(
                "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium",
                EMOTION_COLORS[latest.emotion as Emotion] ??
                  "bg-muted text-muted-foreground border-border",
              )}
            >
              {latest.emotion}
            </span>
          ) : (
            <span className="inline-flex rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs text-muted-foreground">
              Sem registros
            </span>
          )}
        </div>
      </div>

      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </button>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}
