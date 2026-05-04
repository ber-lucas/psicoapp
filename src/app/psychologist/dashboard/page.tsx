import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { LogOut, Users, Key, CalendarDays, ListOrdered } from "lucide-react";
import { logout } from "@/app/(auth)/login/actions";
import { requireRole } from "@/lib/auth";
import {
  getGlobalEmotionFeed,
  getPsychologistPatients,
} from "@/lib/actions/emotion";
import { EmotionFeed } from "@/components/emotion/EmotionFeed";
import { EmotionCalendar } from "@/components/emotion/EmotionCalendar";
import { PatientList } from "@/components/emotion/PatientList";

export const dynamic = "force-dynamic";

/**
 * Renderiza o dashboard principal do Psicólogo.
 *
 * Concentra três visões complementares dos pacientes vinculados em abas:
 * (1) feed cronológico para escanear o "humor" recente, (2) calendário global
 * mostrando dias com atividade e detalhes por dia, e (3) lista navegável
 * para abrir o histórico individual de cada paciente.
 *
 * @returns Server Component com o painel do psicólogo.
 * @throws Redireciona para '/login' se não houver sessão Supabase ativa.
 * @throws Redireciona para '/patient/dashboard' caso a role autenticada seja `PATIENT`.
 */
export default async function PsychologistDashboard() {
  const { dbUser } = await requireRole("PSYCHOLOGIST");

  const [patients, feed] = await Promise.all([
    getPsychologistPatients(),
    getGlobalEmotionFeed(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Painel do Psicólogo
            </h1>
            <p className="text-gray-500">
              Visão geral dos pacientes de Dr(a). {dbUser.name}
            </p>
          </div>
          <form action={logout}>
            <Button variant="outline" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </form>
        </header>

        <main className="grid gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-blue-800 text-lg">
                <Key className="mr-2 h-5 w-5" />
                Seu Código de Convite
              </CardTitle>
              <CardDescription className="text-blue-600">
                Compartilhe este código exclusivo com seus pacientes para que eles possam se cadastrar e se vincular a você.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-mono font-bold tracking-widest text-blue-900">
                {dbUser.doctorCode}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="feed" className="w-full">
            <TabsList>
              <TabsTrigger value="feed">
                <ListOrdered className="mr-2 h-4 w-4" />
                Feed Geral
              </TabsTrigger>
              <TabsTrigger value="calendar">
                <CalendarDays className="mr-2 h-4 w-4" />
                Calendário Global
              </TabsTrigger>
              <TabsTrigger value="patients">
                <Users className="mr-2 h-4 w-4" />
                Pacientes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="mt-4">
              <EmotionFeed logs={feed} />
            </TabsContent>

            <TabsContent value="calendar" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarDays className="mr-2 h-5 w-5 text-gray-600" />
                    Calendário Global
                  </CardTitle>
                  <CardDescription>
                    Dias destacados possuem registros — clique para ver quais pacientes postaram.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {feed.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-10">
                      Nenhum registro até o momento.
                    </div>
                  ) : (
                    <EmotionCalendar logs={feed} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patients" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="mr-2 h-5 w-5 text-gray-600" />
                    Meus Pacientes
                  </CardTitle>
                  <CardDescription>
                    Lista de pacientes vinculados e seus últimos registros.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PatientList patients={patients} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
