/**
 * Ilustração geométrica abstrata usada no `HeroCard` e na tela de login.
 *
 * SVG inline — sem assets externos — para ficar tree-shakeable e responder
 * naturalmente ao tema (usa cores fixas brancas/translúcidas + amarelo via
 * `var(--accent)`, válidas dentro de um background gradiente roxo).
 *
 * @returns Elemento SVG decorativo (`aria-hidden`) escalável.
 */
export function IllustrationDashboard({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Blob de fundo translúcido */}
      <ellipse
        cx="190"
        cy="125"
        rx="140"
        ry="95"
        fill="rgba(255,255,255,0.08)"
      />

      {/* Sol/lua amarela */}
      <circle cx="265" cy="55" r="22" fill="var(--accent)" opacity="0.95" />

      {/* Cards translúcidos "voando" */}
      <rect
        x="25"
        y="60"
        width="80"
        height="14"
        rx="7"
        fill="rgba(255,255,255,0.85)"
      />
      <rect
        x="25"
        y="84"
        width="55"
        height="10"
        rx="5"
        fill="rgba(255,255,255,0.55)"
      />
      <rect
        x="220"
        y="155"
        width="70"
        height="12"
        rx="6"
        fill="rgba(255,255,255,0.7)"
      />

      {/* Silhueta humana abstrata */}
      <g transform="translate(120, 80)">
        {/* Cabeça */}
        <circle cx="40" cy="20" r="18" fill="rgba(255,255,255,0.95)" />
        {/* Tronco */}
        <path
          d="M 20 50 Q 20 40 30 38 L 50 38 Q 60 40 60 50 L 62 110 Q 62 120 52 120 L 28 120 Q 18 120 18 110 Z"
          fill="rgba(255,255,255,0.95)"
        />
        {/* Detalhe do colo (camiseta) */}
        <path
          d="M 30 40 L 40 52 L 50 40 Z"
          fill="var(--accent)"
          opacity="0.8"
        />
        {/* Braço direito relaxado */}
        <path
          d="M 60 50 Q 80 60 78 90"
          stroke="rgba(255,255,255,0.95)"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Pontos decorativos */}
      <circle cx="40" cy="180" r="4" fill="rgba(255,255,255,0.6)" />
      <circle cx="285" cy="200" r="3" fill="rgba(255,255,255,0.5)" />
      <circle cx="65" cy="210" r="2.5" fill="rgba(255,255,255,0.4)" />
    </svg>
  );
}
