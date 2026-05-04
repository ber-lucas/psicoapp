import { Activity, CalendarDays, Flame, Sparkles } from "lucide-react";

import { AppShell } from "@/components/shell/AppShell";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { MetricGrid } from "@/components/dashboard/MetricGrid";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { WeeklyCalendar } from "@/components/dashboard/WeeklyCalendar";
import { LastEmotionCard } from "@/components/dashboard/LastEmotionCard";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import {
  getMyEmotionLogs,
  getPatientDashboardStats,
} from "@/lib/actions/emotion";

export const dynamic = "force-dynamic";

/**
 * Dashboard do paciente — composição final do redesign.
 *
 * Verticalmente: HeroCard com saudação + indicação do psicólogo →
 * MetricGrid (4 KPIs pessoais) → grid 2-col com WeeklyCalendar à
 * esquerda e LastEmotionCard à direita.
 *
 * Postar nova emoção mora na rota dedicada `/patient/journal` para
 * manter o dashboard como visão de leitura, alinhado à inspiração.
 *
 * @returns Server Component do dashboard do paciente.
 * @throws Redireciona para '/login' sem sessão; para '/psychologist/dashboard'
 *   se a role autenticada for `PSYCHOLOGIST`.
 */
export default async function PatientDashboardPage() {
  const { dbUser } = await requireRole("PATIENT");

  const [psychologist, stats, logs] = await Promise.all([
    dbUser.psychologistId
      ? prisma.user.findUnique({
          where: { id: dbUser.psychologistId },
          select: { name: true },
        })
      : Promise.resolve(null),
    getPatientDashboardStats(),
    getMyEmotionLogs(),
  ]);

  const firstName = dbUser.name.split(" ")[0] ?? dbUser.name;
  const subtitle = psychologist
    ? `Acompanhado por Dr(a). ${psychologist.name}`
    : "Como você está se sentindo hoje?";

  return (
    <AppShell
      title="Dashboard"
      subtitle={subtitle}
      role="PATIENT"
      userName={dbUser.name}
      userEmail={dbUser.email}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <HeroCard
          greeting={`Olá, ${firstName}`}
          subtitle="Acompanhe sua jornada emocional e veja seus padrões dos últimos dias."
        />

        <MetricGrid>
          <MetricCard
            icon={Activity}
            label="Total de registros"
            value={stats.totalLogs}
            accent="purple"
          />
          <MetricCard
            icon={Flame}
            label="Sequência atual"
            value={stats.currentStreak}
            hint={stats.currentStreak === 1 ? "dia seguido" : "dias seguidos"}
            accent="yellow"
          />
          <MetricCard
            icon={Sparkles}
            label="Emoção mais frequente"
            value={stats.mostFrequentEmotion ?? "—"}
            accent="cyan"
          />
          <MetricCard
            icon={CalendarDays}
            label="Último registro"
            value={
              stats.lastLog
                ? new Date(stats.lastLog.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                  })
                : "—"
            }
            accent="pink"
          />
        </MetricGrid>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <WeeklyCalendar logs={logs} />
          <LastEmotionCard log={stats.lastLog} />
        </div>
      </div>
    </AppShell>
  );
}
