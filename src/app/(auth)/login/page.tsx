import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { login, signup } from "./actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        
        {/* Mostra mensagem de erro vinda da URL */}
        {params?.error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-100 rounded-md border border-red-200">
            {params.error}
          </div>
        )}

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form action={login}>
              <Card>
                <CardHeader className="space-y-1 text-center">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Bem-vindo de volta
                  </CardTitle>
                  <CardDescription>
                    Entre com seu email para acessar sua conta
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input id="email-login" name="email" type="email" placeholder="seu@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Senha</Label>
                    <Input id="password-login" name="password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Entrar</Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form action={signup}>
              <Card>
                <CardHeader className="space-y-1 text-center">
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    Criar uma conta
                  </CardTitle>
                  <CardDescription>
                    Preencha os dados abaixo para se cadastrar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input id="name" name="name" type="text" placeholder="João da Silva" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input id="email-register" name="email" type="email" placeholder="seu@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Senha</Label>
                    <Input id="password-register" name="password" type="password" required />
                  </div>
                  <div className="space-y-2 pt-2 border-t">
                    <Label htmlFor="inviteCode">Código de Convite</Label>
                    <Input id="inviteCode" name="inviteCode" type="text" placeholder="Ex: DR-A1B2C3 ou Código Mestre" required />
                    <p className="text-xs text-gray-400">
                      Obrigatório. Peça o código ao seu psicólogo para se cadastrar.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Cadastrar</Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
