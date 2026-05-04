import { AppShell } from "@/components/shell/AppShell";
import { PatientGrid } from "@/components/psychologist/PatientGrid";
import { requireRole } from "@/lib/auth";
import { getPsychologistPatients } from "@/lib/actions/emotion";

export const dynamic = "force-dynamic";

/**
 * Aba "Pacientes" do psicólogo — grid de cards clicáveis com Dialog de detalhe.
 *
 * Substitui a antiga rota `/psychologist/patients/[id]`: o detalhe agora abre
 * em um `Dialog` (gerenciado por `PatientGrid`) preservando o contexto da
 * sidebar e simplificando a navegação.
 *
 * @returns Server Component da listagem de pacientes.
 * @throws Redireciona para '/login' sem sessão; para '/patient/dashboard'
 *   se a role autenticada for `PATIENT`.
 */
export default async function PsychologistPatientsPage() {
  const { dbUser } = await requireRole("PSYCHOLOGIST");
  const patients = await getPsychologistPatients();

  return (
    <AppShell
      title="Pacientes"
      subtitle={`${patients.length} ${patients.length === 1 ? "paciente vinculado" : "pacientes vinculados"}`}
      role="PSYCHOLOGIST"
      userName={dbUser.name}
      userEmail={dbUser.email}
    >
      <div className="mx-auto w-full max-w-6xl">
        <PatientGrid patients={patients} />
      </div>
    </AppShell>
  );
}
