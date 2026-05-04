import { Users, Activity, CalendarDays, Sparkles } from "lucide-react";

import { AppShell } from "@/components/shell/AppShell";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { MetricGrid } from "@/components/dashboard/MetricGrid";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { WeeklyCalendar } from "@/components/dashboard/WeeklyCalendar";
import { RecentActivityList } from "@/components/dashboard/RecentActivityList";
import { PatientSummaryList } from "@/components/dashboard/PatientSummaryList";
import { InviteCodeCard } from "@/components/dashboard/InviteCodeCard";
import { requireRole } from "@/lib/auth";
import {
  getPsychologistDashboardStats,
  getPsychologistPatients,
  getPsychologistRecentLogs,
} from "@/lib/actions/emotion";

export const dynamic = "force-dynamic";

/**
 * Dashboard do psicólogo — composição final do redesign.
 *
 * Quatro blocos verticais: HeroCard (saudação) → MetricGrid (4 KPIs) →
 * grid 2-col com WeeklyCalendar + InviteCode na esquerda e
 * PatientSummaryList na direita → RecentActivityList ocupando largura total.
 *
 * Toda a leitura de dados acontece em paralelo via `Promise.all` para
 * minimizar TTFB do dashboard.
 *
 * @returns Server Component completo do dashboard do psicólogo.
 * @throws Redireciona para '/login' sem sessão; para '/patient/dashboard'
 *   se a role autenticada for `PATIENT`.
 */
export default async function PsychologistDashboardPage() {
  const { dbUser } = await requireRole("PSYCHOLOGIST");

  const [stats, patients, recent] = await Promise.all([
    getPsychologistDashboardStats(),
    getPsychologistPatients(),
    getPsychologistRecentLogs(8),
  ]);

  const firstName = dbUser.name.split(" ")[0] ?? dbUser.name;

  return (
    <AppShell
      title="Dashboard"
      subtitle="Visão geral dos pacientes vinculados"
      role="PSYCHOLOGIST"
      userName={dbUser.name}
      userEmail={dbUser.email}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <HeroCard
          greeting={`Olá, Dr(a). ${firstName}`}
          subtitle="Acompanhe o humor recente dos seus pacientes e identifique padrões com poucos cliques."
        />

        <MetricGrid>
          <MetricCard
            icon={Users}
            label="Pacientes vinculados"
            value={stats.totalPatients}
            accent="purple"
          />
          <MetricCard
            icon={CalendarDays}
            label="Registros nesta semana"
            value={stats.logsThisWeek}
            accent="yellow"
          />
          <MetricCard
            icon={Activity}
            label="Registros no mês"
            value={stats.logsThisMonth}
            accent="cyan"
          />
          <MetricCard
            icon={Sparkles}
            label="Emoção mais frequente"
            value={stats.mostFrequentEmotion ?? "—"}
            accent="pink"
          />
        </MetricGrid>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-6">
            <WeeklyCalendar logs={recent} showUser />
            {dbUser.doctorCode && <InviteCodeCard code={dbUser.doctorCode} />}
          </div>
          <PatientSummaryList patients={patients} />
        </div>

        <RecentActivityList logs={recent} />
      </div>
    </AppShell>
  );
}
