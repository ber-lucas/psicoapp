import { requireUser } from "@/lib/auth";

/**
 * Layout do route group autenticado `(app)`.
 *
 * Garante que toda rota dentro desse grupo só seja acessível por
 * usuários com sessão Supabase ativa e registro espelhado no Prisma.
 * A verificação de papel (PATIENT/PSYCHOLOGIST) fica nas próprias páginas
 * via `requireRole`, que também devolve o `dbUser` necessário para o `AppShell`.
 *
 * Não renderiza chrome aqui — cada página orquestra o seu `AppShell`
 * com título/subtítulo próprios.
 *
 * @param children - Subárvore protegida (psychologist/* ou patient/*).
 */
export default async function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return <>{children}</>;
}
