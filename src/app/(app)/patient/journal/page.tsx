import { PenLine } from "lucide-react";

import { AppShell } from "@/components/shell/AppShell";
import { EmotionLogForm } from "@/components/emotion/EmotionLogForm";
import { EmotionFeedFull } from "@/components/emotion/EmotionFeedFull";
import { requireRole } from "@/lib/auth";
import { getMyEmotionLogs } from "@/lib/actions/emotion";

export const dynamic = "force-dynamic";

/**
 * Página "Diário" do paciente — registrar nova emoção e revisitar
 * histórico cronológico em uma única tela.
 *
 * Mantém o `EmotionLogForm` no topo (ação primária) e a lista de
 * registros abaixo, clicáveis para abrir o `EmotionDetailDialog` com
 * a anotação completa.
 *
 * @returns Server Component da página de diário.
 * @throws Redireciona para '/login' sem sessão; para '/psychologist/dashboard'
 *   se a role autenticada for `PSYCHOLOGIST`.
 */
export default async function PatientJournalPage() {
  const { dbUser } = await requireRole("PATIENT");
  const logs = await getMyEmotionLogs();

  return (
    <AppShell
      title="Diário"
      subtitle="Registre como você está e revisite seu histórico"
      role="PATIENT"
      userName={dbUser.name}
      userEmail={dbUser.email}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <PenLine className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-heading text-base font-semibold text-foreground">
                Como você está agora?
              </h2>
              <p className="text-xs text-muted-foreground">
                Você pode registrar mais de uma vez por dia.
              </p>
            </div>
          </div>
          <EmotionLogForm />
        </section>

        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-semibold text-foreground">
              Seus registros
            </h3>
            <span className="text-xs text-muted-foreground">
              {logs.length === 1
                ? "1 registro"
                : `${logs.length} registros`}
            </span>
          </div>
          <EmotionFeedFull
            logs={logs}
            showUser={false}
            emptyMessage="Você ainda não registrou nenhuma emoção. Use o formulário acima para começar."
          />
        </section>
      </div>
    </AppShell>
  );
}
