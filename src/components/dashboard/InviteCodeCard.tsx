import { Key } from "lucide-react";

/**
 * Cartão pequeno que destaca o código de convite do psicólogo.
 *
 * Mantemos o código exposto no dashboard porque é como o psicólogo
 * vincula novos pacientes — esconder em "configurações" tornaria o
 * onboarding fricciental. Estilizado com fundo `secondary` (roxo claro)
 * para se destacar sem competir com o HeroCard.
 *
 * @param code - Código exclusivo do psicólogo (`User.doctorCode`).
 */
export function InviteCodeCard({ code }: { code: string }) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-secondary bg-secondary/60 px-5 py-4 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
        <Key className="h-6 w-6" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-xs font-medium text-secondary-foreground/80">
          Código de convite
        </span>
        <span className="font-mono text-xl font-semibold tracking-widest text-secondary-foreground">
          {code}
        </span>
        <span className="text-xs text-secondary-foreground/70">
          Compartilhe com seus pacientes para vincular novos cadastros.
        </span>
      </div>
    </div>
  );
}
