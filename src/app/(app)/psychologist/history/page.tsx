import { AppShell } from "@/components/shell/AppShell";
import { EmotionFeedFull } from "@/components/emotion/EmotionFeedFull";
import { requireRole } from "@/lib/auth";
import { getGlobalEmotionFeedFull } from "@/lib/actions/emotion";

export const dynamic = "force-dynamic";

/**
 * Aba "Histórico" do psicólogo — lista cronológica completa de todas as
 * emoções postadas pelos pacientes vinculados, com Dialog de detalhe.
 *
 * Diferente do "Feed Geral" do dashboard, aqui não há limite de itens —
 * o psicólogo navega por toda a história de registros.
 *
 * @returns Server Component da aba Histórico.
 * @throws Redireciona para '/login' sem sessão; para '/patient/dashboard'
 *   se a role autenticada for `PATIENT`.
 */
export default async function PsychologistHistoryPage() {
  const { dbUser } = await requireRole("PSYCHOLOGIST");
  const logs = await getGlobalEmotionFeedFull();

  return (
    <AppShell
      title="Histórico"
      subtitle={`${logs.length} ${logs.length === 1 ? "registro" : "registros"} de seus pacientes`}
      role="PSYCHOLOGIST"
      userName={dbUser.name}
      userEmail={dbUser.email}
    >
      <div className="mx-auto w-full max-w-3xl">
        <EmotionFeedFull
          logs={logs}
          showUser
          emptyMessage="Nenhum paciente registrou emoções ainda."
        />
      </div>
    </AppShell>
  );
}
