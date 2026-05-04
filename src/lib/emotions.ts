/**
 * Lista canônica de emoções aceitas pelo Diário de Emoções.
 *
 * Mantida como const tuple (não enum do Prisma) para permitir evolução do
 * conjunto sem exigir nova migração de banco. Os registros são persistidos
 * como `String` em `EmotionLog.emotion`, mas a Server Action de criação
 * valida o valor recebido contra esta lista — é nosso enum de aplicação.
 */
export const EMOTIONS = [
  "Ansiedade",
  "Alegria",
  "Tristeza",
  "Raiva",
  "Paz",
] as const;

/** Emoção válida aceita pelo app. */
export type Emotion = (typeof EMOTIONS)[number];

/**
 * Verifica se um valor arbitrário é uma emoção reconhecida.
 *
 * @param value - Valor recebido (geralmente vindo de FormData/cliente).
 * @returns `true` se `value` faz parte de {@link EMOTIONS}, com refinamento de tipo.
 */
export function isEmotion(value: unknown): value is Emotion {
  return typeof value === "string" && (EMOTIONS as readonly string[]).includes(value);
}

/**
 * Mapa de classes Tailwind para badges coloridos por emoção.
 *
 * Usado por feed, tabela e dialog de detalhes para padronizar o vocabulário visual
 * — facilita o psicólogo escanear o feed rapidamente.
 */
export const EMOTION_COLORS: Record<Emotion, string> = {
  Ansiedade: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Alegria: "bg-green-100 text-green-800 border-green-200",
  Tristeza: "bg-blue-100 text-blue-800 border-blue-200",
  Raiva: "bg-rose-100 text-rose-800 border-rose-200",
  Paz: "bg-cyan-100 text-cyan-800 border-cyan-200",
};
