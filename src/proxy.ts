import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANTE: getUser() faz uma requisição segura para o Supabase e renova o token se necessário.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");
  const isProtectedRoute = 
    request.nextUrl.pathname.startsWith("/patient") || 
    request.nextUrl.pathname.startsWith("/psychologist");

  if (!user && isProtectedRoute) {
    // Usuário não logado tentando acessar dashboard -> manda pro login
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    // Usuário logado tentando acessar login -> manda pro dashboard principal
    // (A checagem de role exata de psicólogo/paciente é feita dentro das páginas Server Components)
    const url = request.nextUrl.clone();
    url.pathname = "/patient/dashboard"; // Redirecionamento base
    return NextResponse.redirect(url);
  }

  // Se acessar a raiz (/) e não estiver logado, redireciona pra login
  if (request.nextUrl.pathname === "/") {
      const url = request.nextUrl.clone();
      if(user) {
         url.pathname = "/patient/dashboard";
      } else {
         url.pathname = "/login";
      }
      return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
