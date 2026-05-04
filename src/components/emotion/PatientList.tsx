import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EMOTION_COLORS, type Emotion } from "@/lib/emotions";
import { cn } from "@/lib/utils";
import type { PatientWithLatestLog } from "@/lib/actions/emotion";

type PatientListProps = {
  patients: PatientWithLatestLog[];
};

/**
 * Tabela de pacientes vinculados ao psicólogo, mostrando o último registro
 * de cada um e um link para a página individual de detalhes.
 *
 * Server Component — toda interação fica na navegação por link. Mantemos a
 * coluna "Última emoção" como ponto de atenção rápido para identificar quem
 * pode precisar de retorno.
 *
 * @param patients - Pacientes vindos de `getPsychologistPatients`, com no
 *   máximo 1 `EmotionLog` recente embutido em `emotionLogs`.
 */
export function PatientList({ patients }: PatientListProps) {
  if (patients.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-10 text-center text-sm text-muted-foreground">
        Você ainda não possui pacientes vinculados. Compartilhe seu código de
        convite para começar.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome do Paciente</TableHead>
            <TableHead>Última Emoção</TableHead>
            <TableHead>Data do Registro</TableHead>
            <TableHead className="text-right">Ação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => {
            const latest = patient.emotionLogs[0];
            return (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>
                  {latest ? (
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        EMOTION_COLORS[latest.emotion as Emotion] ??
                          "bg-gray-100 text-gray-800 border-gray-200",
                      )}
                    >
                      {latest.emotion}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Sem registros
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {latest
                    ? formatDistanceToNow(new Date(latest.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/psychologist/patients/${patient.id}`}
                    className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                  >
                    Ver Detalhes
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
