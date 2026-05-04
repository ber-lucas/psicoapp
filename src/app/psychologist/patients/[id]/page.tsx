import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Activity, User as UserIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { getPatientEmotionLogs } from "@/lib/actions/emotion";
import { EmotionCalendar } from "@/components/emotion/EmotionCalendar";

export const dynamic = "force-dynamic";

type PatientDetailsPageProps = {
  params: Promise<{ id: string }>;
};

/**
 * Página de detalhes de um paciente acessada pelo psicólogo logado.
 *
 * Antes de carregar dados, valida que o paciente solicitado realmente está
 * vinculado ao psicólogo autenticado — qualquer acesso a paciente de terceiros
 * retorna 404 para não vazar a existência do registro. O calendário individual
 * reaproveita o mesmo `EmotionCalendar` usado no dashboard do paciente.
 *
 * @param params - Parâmetros dinâmicos da rota; `params.id` é o UUID do paciente.
 * @returns Server Component com cabeçalho do paciente e calendário com histórico.
 * @throws Redireciona para '/login' se não houver sessão ativa.
 * @throws Redireciona para '/patient/dashboard' se o usuário autenticado não for `PSYCHOLOGIST`.
 * @throws `notFound()` se o paciente não existir ou não estiver vinculado a este psicólogo.
 */
export default async function PatientDetailsPage({
  params,
}: PatientDetailsPageProps) {
  const { id } = await params;
  const { dbUser } = await requireRole("PSYCHOLOGIST");

  const patient = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      psychologistId: true,
      createdAt: true,
    },
  });

  if (
    !patient ||
    patient.role !== "PATIENT" ||
    patient.psychologistId !== dbUser.id
  ) {
    notFound();
  }

  const logs = await getPatientEmotionLogs(patient.id);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <header className="flex items-center justify-between pb-6 border-b">
          <div className="space-y-2">
            <Link
              href="/psychologist/dashboard"
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "px-2 -ml-2",
              )}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center">
                <UserIcon className="mr-2 h-7 w-7 text-blue-600" />
                {patient.name}
              </h1>
              <p className="text-gray-500 text-sm">{patient.email}</p>
            </div>
          </div>
        </header>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-gray-600" />
              Histórico de Emoções
            </CardTitle>
            <CardDescription>
              {logs.length === 0
                ? "Este paciente ainda não registrou emoções."
                : "Dias destacados possuem registros — clique para ver detalhes."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {logs.length > 0 && (
              <EmotionCalendar logs={logs} patientName={patient.name} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
