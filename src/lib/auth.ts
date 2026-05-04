import "server-only";
import { redirect } from "next/navigation";
import type { Role, User } from "@prisma/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Resultado consolidado de autenticação contendo a sessão Supabase
 * (fonte da verdade da autenticação) e o registro do usuário no Prisma
 * (fonte da role e dados de domínio do app).
 */
export type AuthContext = {
  supabaseUser: SupabaseUser;
  dbUser: User;
};

/**
 * Garante que existe um usuário autenticado e que ele possui registro espelhado no Prisma.
 *
 * O Supabase é a fonte da verdade da autenticação, mas role/vínculos vivem no nosso banco.
 * Sem essa centralização, cada Server Action/Component repetiria a chamada `getUser()` +
 * `prisma.user.findUnique()` (ver dashboards atuais), facilitando inconsistências de auth.
 *
 * @returns Contexto com o usuário do Supabase e o usuário do Prisma já hidratado.
 * @throws Redireciona para '/login' caso não exista sessão Supabase ativa
 *   ou caso o usuário ainda não tenha registro correspondente no banco.
 */
export async function requireUser(): Promise<AuthContext> {
  const supabase = await createClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  if (!supabaseUser) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: supabaseUser.id },
  });

  if (!dbUser) {
    redirect("/login");
  }

  return { supabaseUser, dbUser };
}

/**
 * Garante que o usuário autenticado possua a role esperada para acessar o recurso.
 *
 * Centraliza a regra de autorização por papel (PATIENT × PSYCHOLOGIST) usada em
 * Server Actions e Server Components. Caso a role não bata, redireciona para o
 * dashboard correto da role real do usuário, evitando "telas vazias" quando um
 * paciente tenta abrir uma rota de psicólogo (e vice-versa).
 *
 * @param role - Papel obrigatório para a operação ('PATIENT' ou 'PSYCHOLOGIST').
 * @returns Contexto autenticado quando a role bate.
 * @throws Redireciona para '/login' se não autenticado.
 * @throws Redireciona para o dashboard apropriado se a role for diferente da requerida.
 */
export async function requireRole(role: Role): Promise<AuthContext> {
  const ctx = await requireUser();

  if (ctx.dbUser.role !== role) {
    redirect(
      ctx.dbUser.role === "PSYCHOLOGIST"
        ? "/psychologist/dashboard"
        : "/patient/dashboard",
    );
  }

  return ctx;
}
