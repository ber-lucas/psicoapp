import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LogOut, Users, Key } from "lucide-react";
import { logout } from "@/app/(auth)/login/actions";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Renderiza o dashboard principal do Psicólogo.
 * Exibe o código de convite único do profissional e a lista de pacientes vinculados.
 * 
 * @returns Componente React (Server Component) com o painel do psicólogo.
 * @throws Redireciona para '/login' se o usuário não possuir sessão ativa.
 * @throws Redireciona para '/patient/dashboard' caso o usuário tenha perfil de Paciente.
 */
export default async function PsychologistDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Busca a role do usuário no banco
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (dbUser?.role !== "PSYCHOLOGIST") {
    // Se não for psicólogo, manda pro dashboard de paciente
    redirect("/patient/dashboard");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="flex items-center justify-between pb-6 border-b">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Painel do Psicólogo
            </h1>
            <p className="text-gray-500">Visão geral dos pacientes de Dr(a). {dbUser?.name}</p>
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

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-gray-600" />
                Meus Pacientes
              </CardTitle>
              <CardDescription>
                Lista de pacientes e seus últimos registros de emoções.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                    <TableRow>
                      <TableCell className="font-medium">João Silva</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          Ansioso
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">Hoje, 10:30</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Maria Souza</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Feliz
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">Ontem, 18:45</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
