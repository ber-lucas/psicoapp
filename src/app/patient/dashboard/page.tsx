import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut, Activity, PenLine } from "lucide-react";
import { logout } from "@/app/(auth)/login/actions";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getMyEmotionLogs } from "@/lib/actions/emotion";
import { EmotionLogForm } from "@/components/emotion/EmotionLogForm";
import { EmotionCalendar } from "@/components/emotion/EmotionCalendar";

export const dynamic = "force-dynamic";

/**
 * Renderiza o dashboard principal do Paciente.
 *
 * Centraliza a página de uso diário do paciente: registrar a emoção do momento
 * (formulário) e revisitar o histórico em calendário. A leitura de logs é feita
 * no servidor para evitar flash de UI vazia, e a lista é repassada ao calendário
 * (Client Component) que cuida da interação de detalhes do dia.
 *
 * @returns Server Component com o painel do paciente.
 * @throws Redireciona para '/login' se não houver sessão Supabase ativa.
 * @throws Redireciona para '/psychologist/dashboard' caso a role autenticada seja `PSYCHOLOGIST`.
 */
export default async function PatientDashboard() {
  const { dbUser } = await requireRole("PATIENT");

  const [psychologist, logs] = await Promise.all([
    dbUser.psychologistId
      ? prisma.user.findUnique({
          where: { id: dbUser.psychologistId },
          select: { name: true },
        })
      : Promise.resolve(null),
    getMyEmotionLogs(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard do Paciente
            </h1>
            <p className="text-gray-500 mt-1">
              Como você está se sentindo hoje, {dbUser.name}?
            </p>
            {psychologist && (
              <div className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                Acompanhado por Dr(a). {psychologist.name}
              </div>
            )}
          </div>
          <form action={logout}>
            <Button variant="outline" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </form>
        </header>

        <main className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PenLine className="mr-2 h-5 w-5 text-blue-600" />
                Registrar Emoção
              </CardTitle>
              <CardDescription>
                Anote sua emoção do momento. Você pode registrar mais de uma vez por dia.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EmotionLogForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-gray-600" />
                Histórico
              </CardTitle>
              <CardDescription>
                Os dias com registro aparecem destacados — clique para ver os detalhes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="text-center text-sm text-gray-500 py-10">
                  Nenhum registro encontrado ainda.
                </div>
              ) : (
                <EmotionCalendar logs={logs} />
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
