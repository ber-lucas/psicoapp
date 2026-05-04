import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EMOTION_COLORS, type Emotion } from "@/lib/emotions";
import { cn } from "@/lib/utils";
import type { PatientWithLatestLog } from "@/lib/actions/emotion";

/**
 * Coluna lateral do dashboard do psicólogo com a lista compacta de
 * pacientes vinculados — substitui a "Client list" da inspiração com
 * conteúdo do domínio (paciente + última emoção).
 *
 * Cada item leva à aba "Pacientes" (rota completa); o detalhe individual
 * é aberto lá via Dialog. Manter este componente apenas como atalho
 * visual evita duplicar o `PatientCard` aqui.
 *
 * @param patients - Pacientes vinculados com `emotionLogs[0]` opcional.
 */
export function PatientSummaryList({
  patients,
}: {
  patients: PatientWithLatestLog[];
}) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Seus pacientes
        </h3>
        <Link
          href="/psychologist/patients"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Ver todos <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {patients.length === 0 ? (
        <div className="px-5 py-6 text-center text-sm text-muted-foreground">
          Nenhum paciente vinculado ainda. Compartilhe seu código de convite
          para começar.
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {patients.slice(0, 6).map((patient) => {
            const latest = patient.emotionLogs[0];
            return (
              <li
                key={patient.id}
                className="flex items-center gap-3 px-5 py-3"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(patient.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium text-foreground">
                    {patient.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {latest ? "Último registro" : "Sem registros"}
                  </span>
                </div>
                {latest ? (
                  <span
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                      EMOTION_COLORS[latest.emotion as Emotion] ??
                        "bg-muted text-muted-foreground border-border",
                    )}
                  >
                    {latest.emotion}
                  </span>
                ) : (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    —
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return (parts[0]!.charAt(0) + parts[parts.length - 1]!.charAt(0)).toUpperCase();
}
