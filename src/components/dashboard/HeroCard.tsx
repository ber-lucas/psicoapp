import { IllustrationDashboard } from "@/components/shell/illustrations/IllustrationDashboard";

/**
 * Cartão de saudação no topo dos dashboards.
 *
 * Padroniza a abertura visual de toda página de dashboard (psicólogo
 * e paciente) — fundo gradiente roxo, texto à esquerda, ilustração
 * decorativa à direita. A ilustração é escondida em telas menores
 * para preservar leitura do texto.
 *
 * @param greeting - Frase principal (ex: "Olá, Bernardo").
 * @param subtitle - Mensagem complementar (ex: "Como você está se
 *   sentindo hoje?"). Renderizada com peso menor abaixo do greeting.
 */
export function HeroCard({
  greeting,
  subtitle,
}: {
  greeting: string;
  subtitle: string;
}) {
  return (
    <div className="relative flex w-full overflow-hidden rounded-3xl bg-gradient-to-br from-hero-from to-hero-to text-primary-foreground shadow-sm">
      <div className="z-10 flex flex-1 flex-col justify-center gap-2 p-6 sm:p-8">
        <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
          {greeting}
        </h2>
        <p className="max-w-md text-sm text-primary-foreground/85 sm:text-base">
          {subtitle}
        </p>
      </div>
      <IllustrationDashboard className="hidden h-full w-72 shrink-0 sm:block" />
    </div>
  );
}
