import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, SmilePlus, Activity, PenLine } from "lucide-react";
import { logout } from "@/app/(auth)/login/actions";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Renderiza o dashboard principal do Paciente.
 * Busca os dados do usuário autenticado no Supabase e cruza com os dados do Prisma,
 * incluindo informações do psicólogo vinculado, se houver.
 * 
 * @returns Componente React (Server Component) com o painel do paciente.
 * @throws Redireciona para '/login' se o usuário não possuir sessão ativa no Supabase.
 * @throws Redireciona para '/psychologist/dashboard' caso o usuário autenticado tenha perfil de Psicólogo.
 */
export default async function PatientDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { psychologist: true }
  });

  if (dbUser?.role === "PSYCHOLOGIST") {
    redirect("/psychologist/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex items-center justify-between pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Dashboard do Paciente
            </h1>
            <p className="text-gray-500 mt-1">Como você está se sentindo hoje, {dbUser?.name}?</p>
            {dbUser?.psychologist && (
              <div className="mt-2 inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                Acompanhado por Dr(a). {dbUser.psychologist.name}
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
          {/* Card de Registro de Emoção */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PenLine className="mr-2 h-5 w-5 text-blue-600" />
                Registrar Emoção
              </CardTitle>
              <CardDescription>
                Anote sua emoção do dia para acompanhamento do seu psicólogo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emotion">Sentimento Principal</Label>
                <Input id="emotion" placeholder="Ex: Ansioso, Feliz, Cansado" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Anotações (opcional)</Label>
                <Textarea
                  id="notes"
                  className="min-h-[100px]"
                  placeholder="Escreva um pouco sobre o porquê..."
                />
              </div>
              <Button className="w-full">
                <SmilePlus className="mr-2 h-4 w-4" />
                Salvar Registro
              </Button>
            </CardContent>
          </Card>

          {/* Card de Histórico */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-gray-600" />
                Últimos Registros
              </CardTitle>
              <CardDescription>
                Seu histórico recente de emoções.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-sm text-gray-500 py-10">
                Nenhum registro encontrado ainda.
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
