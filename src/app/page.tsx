import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * Página raiz do app.
 *
 * Não há landing page pública — usuário autenticado é levado direto ao
 * dashboard correspondente à sua role; quem não tem sessão cai no login.
 *
 * @throws Sempre redireciona — para `/psychologist/dashboard`,
 *   `/patient/dashboard` ou `/login` conforme o estado de autenticação.
 */
export default async function RootPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (!dbUser) {
    redirect("/login");
  }

  redirect(
    dbUser.role === "PSYCHOLOGIST"
      ? "/psychologist/dashboard"
      : "/patient/dashboard",
  );
}
