import { Brain } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IllustrationDashboard } from "@/components/shell/illustrations/IllustrationDashboard";
import { login, signup } from "./actions";

export const dynamic = "force-dynamic";

/**
 * Página de login/cadastro com layout split inspirado na nova identidade
 * visual do app — gradiente roxo à esquerda, formulário à direita.
 *
 * Em mobile o gradiente vira banner curto no topo. Mantém intactas as
 * Server Actions `login` e `signup` (apenas o invólucro foi redesenhado).
 *
 * @param searchParams - `error` é renderizado em banner vermelho quando
 *   alguma das Server Actions falhar e redirecionar com a query string.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      <aside className="relative flex h-40 shrink-0 flex-col overflow-hidden bg-gradient-to-br from-hero-from to-hero-to p-6 text-primary-foreground sm:h-48 lg:h-auto lg:w-1/2 lg:p-16">
        <div className="z-10 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Brain className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-semibold">PsicoApp</span>
        </div>

        <div className="z-10 hidden flex-1 flex-col justify-center lg:flex">
          <div className="max-w-sm">
            <h1 className="font-heading text-3xl font-semibold leading-tight">
              Diário de emoções e acompanhamento psicológico
            </h1>
            <p className="mt-3 text-base text-primary-foreground/85">
              Acompanhe sua jornada emocional ou a de seus pacientes em um só lugar.
            </p>
          </div>
        </div>

        <IllustrationDashboard className="absolute right-0 top-1/2 hidden h-72 w-96 -translate-y-1/2 lg:block" />

        <p className="z-10 hidden text-xs text-primary-foreground/50 lg:block">
          © 2026 PsicoApp. Todos os direitos reservados.
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {params?.error && (
            <div className="mb-4 rounded-2xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {params.error}
            </div>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form action={login} className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
                <div className="mb-6 space-y-1 text-center">
                  <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                    Bem-vindo de volta
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Entre com seu email para acessar sua conta
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input
                      id="email-login"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Senha</Label>
                    <Input
                      id="password-login"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Entrar
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form action={signup} className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm sm:p-8">
                <div className="mb-6 space-y-1 text-center">
                  <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
                    Criar uma conta
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Preencha os dados abaixo para se cadastrar
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="João da Silva"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input
                      id="email-register"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-register">Senha</Label>
                    <Input
                      id="password-register"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                  <div className="space-y-2 border-t border-border pt-4">
                    <Label htmlFor="inviteCode">Código de Convite</Label>
                    <Input
                      id="inviteCode"
                      name="inviteCode"
                      type="text"
                      placeholder="Ex: DR-A1B2C3 ou Código Mestre"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Obrigatório. Peça o código ao seu psicólogo para se cadastrar.
                    </p>
                  </div>
                  <Button type="submit" className="w-full">
                    Cadastrar
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
