import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Tonalidade visual do ícone do `MetricCard`.
 *
 * Mapeada para um par fixo de classes Tailwind para evitar concatenação
 * dinâmica (que quebra o purge do Tailwind v4). Adições futuras precisam
 * ser registradas em `ACCENT_CLASSES`.
 */
export type MetricAccent = "purple" | "yellow" | "cyan" | "pink";

const ACCENT_CLASSES: Record<MetricAccent, string> = {
  purple: "bg-primary/10 text-primary",
  yellow: "bg-accent/30 text-accent-foreground",
  cyan: "bg-cyan-100 text-cyan-700",
  pink: "bg-rose-100 text-rose-700",
};

/**
 * Cartão pequeno horizontal com ícone à esquerda e métrica à direita.
 *
 * Usado em grupos de 4 (`MetricGrid`) nos dashboards. O `value` aceita
 * tanto número quanto string — datas formatadas, "—", emoção mais
 * frequente etc. cabem aqui sem precisar formatar antes.
 *
 * @param icon - Ícone lucide a renderizar dentro do bloco colorido.
 * @param label - Rótulo curto da métrica.
 * @param value - Valor principal exibido em destaque.
 * @param accent - Cor de fundo do bloco do ícone.
 * @param hint - Linha secundária opcional sob o valor (ex: "vs semana
 *   passada"). Mantida discreta para não competir com o número principal.
 */
export function MetricCard({
  icon: Icon,
  label,
  value,
  accent = "purple",
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  accent?: MetricAccent;
  hint?: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
          ACCENT_CLASSES[accent],
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <span className="font-heading text-2xl font-semibold leading-tight text-foreground">
          {value}
        </span>
        {hint && (
          <span className="truncate text-xs text-muted-foreground">{hint}</span>
        )}
      </div>
    </div>
  );
}
