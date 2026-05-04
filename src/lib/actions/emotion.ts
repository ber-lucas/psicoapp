"use server";

import { revalidatePath } from "next/cache";
import type { EmotionLog, User } from "@prisma/client";
import {
  startOfMonth,
  startOfWeek,
  subDays,
  startOfDay,
} from "date-fns";

import { prisma } from "@/lib/prisma";
import { requireRole, requireUser } from "@/lib/auth";
import { isEmotion, type Emotion } from "@/lib/emotions";

/**
 * Tipo público de paciente devolvido ao psicólogo, com o último registro
 * de emoção embutido (1 elemento) para uso em listas/tabelas.
 */
export type PatientWithLatestLog = User & {
  emotionLogs: EmotionLog[];
};

/**
 * Tipo público de log de emoção que inclui o paciente que postou —
 * usado pelo feed agregado do psicólogo.
 */
export type EmotionLogWithUser = EmotionLog & {
  user: User;
};

/**
 * Registra uma nova entrada do Diário de Emoções para o paciente autenticado.
 *
 * Apenas usuários com role `PATIENT` podem postar; psicólogos não têm diário próprio.
 * O paciente pode realizar múltiplos registros no mesmo dia (representando diferentes
 * momentos/gatilhos), por isso não há checagem de unicidade por data.
 *
 * @param emotion - Sentimento principal selecionado pelo paciente. Precisa ser uma das
 *   emoções listadas em {@link EMOTIONS} para evitar lixo no banco.
 * @param notes - Relato livre opcional sobre gatilhos, vivências ou contexto do registro.
 * @returns O `EmotionLog` recém-criado, já com `id` e `createdAt`.
 * @throws `Error('Unauthorized')` quando o usuário autenticado não for paciente.
 * @throws `Error('Invalid emotion')` quando o valor recebido não estiver na lista permitida.
 */
export async function createEmotionLog(
  emotion: string,
  notes?: string,
): Promise<EmotionLog> {
  const { dbUser } = await requireRole("PATIENT");

  if (!isEmotion(emotion)) {
    throw new Error("Invalid emotion");
  }

  const trimmedNotes = notes?.trim() ? notes.trim() : null;

  const log = await prisma.emotionLog.create({
    data: {
      userId: dbUser.id,
      emotion,
      notes: trimmedNotes,
    },
  });

  // Dashboard do paciente lista os registros recentes; psicólogo vinculado
  // também precisa enxergar o novo dado em seu feed agregado.
  revalidatePath("/patient/dashboard");
  revalidatePath("/psychologist/dashboard");

  return log;
}

/**
 * Retorna o histórico completo de emoções do paciente autenticado.
 *
 * Atende ao calendário e à timeline pessoal do paciente. Ordenado do mais
 * recente para o mais antigo para casar com a expectativa visual.
 *
 * @returns Lista de `EmotionLog` do próprio usuário, ordenados por `createdAt desc`.
 * @throws Redireciona para '/login' se não autenticado.
 * @throws Redireciona para o dashboard correto se o usuário não for `PATIENT`.
 */
export async function getMyEmotionLogs(): Promise<EmotionLog[]> {
  const { dbUser } = await requireRole("PATIENT");

  return prisma.emotionLog.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Busca o histórico de emoções de um paciente específico aplicando
 * a regra de privacidade do produto: somente o próprio paciente ou
 * o psicólogo a quem ele está vinculado podem ler esse dado.
 *
 * @param patientId - UUID do paciente cujo histórico se deseja consultar.
 * @returns Lista de `EmotionLog` daquele paciente, ordenados do mais recente para o mais antigo.
 * @throws `Error('Unauthorized')` quando o solicitante não é o próprio paciente
 *   nem o psicólogo vinculado a ele.
 * @throws `Error('Patient not found')` quando o `patientId` não corresponde a
 *   um usuário com role `PATIENT`.
 */
export async function getPatientEmotionLogs(
  patientId: string,
): Promise<EmotionLog[]> {
  const { dbUser } = await requireUser();

  const patient = await prisma.user.findUnique({
    where: { id: patientId },
    select: { id: true, role: true, psychologistId: true },
  });

  if (!patient || patient.role !== "PATIENT") {
    throw new Error("Patient not found");
  }

  const isOwner = dbUser.id === patient.id && dbUser.role === "PATIENT";
  const isLinkedPsychologist =
    dbUser.role === "PSYCHOLOGIST" && patient.psychologistId === dbUser.id;

  if (!isOwner && !isLinkedPsychologist) {
    throw new Error("Unauthorized");
  }

  return prisma.emotionLog.findMany({
    where: { userId: patient.id },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Lista os pacientes vinculados ao psicólogo autenticado, junto do
 * último registro de emoção de cada um (para preview na tabela do dashboard).
 *
 * @returns Pacientes com array `emotionLogs` contendo no máximo 1 elemento
 *   (o registro mais recente; vazio quando o paciente nunca postou).
 * @throws Redireciona para '/login' se não autenticado.
 * @throws Redireciona ao dashboard de paciente se a role do usuário não for `PSYCHOLOGIST`.
 */
export async function getPsychologistPatients(): Promise<PatientWithLatestLog[]> {
  const { dbUser } = await requireRole("PSYCHOLOGIST");

  return prisma.user.findMany({
    where: { psychologistId: dbUser.id, role: "PATIENT" },
    orderBy: { name: "asc" },
    include: {
      emotionLogs: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });
}

/**
 * Feed agregado dos registros de todos os pacientes vinculados ao psicólogo
 * autenticado, do mais recente para o mais antigo.
 *
 * Limitado a 100 itens — entradas mais antigas devem ser acessadas pela
 * página individual do paciente, evitando timelines gigantes na home.
 *
 * @returns Logs ordenados por `createdAt desc`, cada um com o paciente embutido.
 * @throws Redireciona para '/login' se não autenticado.
 * @throws Redireciona ao dashboard de paciente se a role não for `PSYCHOLOGIST`.
 */
export async function getGlobalEmotionFeed(): Promise<EmotionLogWithUser[]> {
  const { dbUser } = await requireRole("PSYCHOLOGIST");

  return prisma.emotionLog.findMany({
    where: { user: { psychologistId: dbUser.id } },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { user: true },
  });
}

/**
 * Variante sem cap do feed agregado, usada na aba "Histórico" do psicólogo
 * onde o usuário deve poder navegar por todos os registros já feitos por
 * seus pacientes vinculados.
 *
 * Mantida separada de `getGlobalEmotionFeed` para deixar explícito o contrato
 * (a versão "Feed" da home é deliberadamente limitada para não sobrecarregar
 * o dashboard).
 *
 * @returns Todos os logs dos pacientes vinculados, ordenados por `createdAt desc`.
 * @throws Redireciona para '/login' se não autenticado.
 * @throws Redireciona ao dashboard de paciente se a role não for `PSYCHOLOGIST`.
 */
export async function getGlobalEmotionFeedFull(): Promise<EmotionLogWithUser[]> {
  const { dbUser } = await requireRole("PSYCHOLOGIST");

  return prisma.emotionLog.findMany({
    where: { user: { psychologistId: dbUser.id } },
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
}

/**
 * Lista compacta dos registros mais recentes feitos por pacientes
 * vinculados ao psicólogo — alimenta a coluna "Atividade Recente"
 * do dashboard.
 *
 * @param limit - Número máximo de itens a retornar (default 8).
 * @returns Logs ordenados por `createdAt desc` com paciente embutido.
 * @throws Redireciona para '/login' se não autenticado.
 * @throws Redireciona ao dashboard de paciente se a role não for `PSYCHOLOGIST`.
 */
export async function getPsychologistRecentLogs(
  limit = 8,
): Promise<EmotionLogWithUser[]> {
  const { dbUser } = await requireRole("PSYCHOLOGIST");

  return prisma.emotionLog.findMany({
    where: { user: { psychologistId: dbUser.id } },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: true },
  });
}

/**
 * Métricas agregadas do dashboard do psicólogo.
 *
 * Concentra os números exibidos nos `MetricCard`s — nº de pacientes
 * vinculados, contagens de registros na semana e no mês corrente,
 * e a emoção mais frequente entre os pacientes (visão "humor coletivo").
 *
 * Cálculos rodam no banco para `count` e em memória para `mostFrequent`
 * porque o volume esperado é baixo e simplifica o código.
 *
 * @returns Estrutura com `totalPatients`, `logsThisWeek`, `logsThisMonth`
 *   e `mostFrequentEmotion` (ou `null` se não houver registros).
 * @throws Redireciona para '/login' se não autenticado.
 * @throws Redireciona ao dashboard de paciente se a role não for `PSYCHOLOGIST`.
 */
export async function getPsychologistDashboardStats(): Promise<{
  totalPatients: number;
  logsThisWeek: number;
  logsThisMonth: number;
  mostFrequentEmotion: Emotion | null;
}> {
  const { dbUser } = await requireRole("PSYCHOLOGIST");

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);
  const baseWhere = { user: { psychologistId: dbUser.id } } as const;

  const [totalPatients, logsThisWeek, logsThisMonth, allEmotions] =
    await Promise.all([
      prisma.user.count({
        where: { psychologistId: dbUser.id, role: "PATIENT" },
      }),
      prisma.emotionLog.count({
        where: { ...baseWhere, createdAt: { gte: weekStart } },
      }),
      prisma.emotionLog.count({
        where: { ...baseWhere, createdAt: { gte: monthStart } },
      }),
      prisma.emotionLog.findMany({
        where: baseWhere,
        select: { emotion: true },
      }),
    ]);

  return {
    totalPatients,
    logsThisWeek,
    logsThisMonth,
    mostFrequentEmotion: pickMostFrequent(allEmotions.map((l) => l.emotion)),
  };
}

/**
 * Métricas agregadas do dashboard do paciente.
 *
 * Inclui contagem total de registros, sequência atual de dias consecutivos
 * (streak), emoção mais frequente do próprio paciente e o último log para
 * destacar no card lateral. A streak considera tolerância para "ainda não
 * postou hoje" — se o último log foi ontem, a sequência continua válida.
 *
 * @returns Estatísticas pessoais do paciente.
 * @throws Redireciona para '/login' se não autenticado.
 * @throws Redireciona ao dashboard do psicólogo se a role for `PSYCHOLOGIST`.
 */
export async function getPatientDashboardStats(): Promise<{
  totalLogs: number;
  currentStreak: number;
  mostFrequentEmotion: Emotion | null;
  lastLog: EmotionLog | null;
}> {
  const { dbUser } = await requireRole("PATIENT");

  const logs = await prisma.emotionLog.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
  });

  return {
    totalLogs: logs.length,
    currentStreak: calculateStreak(logs.map((l) => l.createdAt)),
    mostFrequentEmotion: pickMostFrequent(logs.map((l) => l.emotion)),
    lastLog: logs[0] ?? null,
  };
}

/**
 * Conta ocorrências em uma lista de strings e devolve a mais frequente
 * que ainda corresponde a uma {@link Emotion} válida.
 *
 * Tolera valores antigos que possam ter saído da lista canônica
 * (ex: emoção descontinuada) — esses entram no `unknown` e nunca são
 * retornados como "mais frequente", evitando renderizar badges
 * inconsistentes na UI.
 */
function pickMostFrequent(emotions: string[]): Emotion | null {
  if (emotions.length === 0) return null;

  const counts = new Map<string, number>();
  for (const e of emotions) {
    counts.set(e, (counts.get(e) ?? 0) + 1);
  }

  let bestKey: string | null = null;
  let bestCount = -1;
  for (const [key, count] of counts) {
    if (count > bestCount) {
      bestKey = key;
      bestCount = count;
    }
  }

  return bestKey && isEmotion(bestKey) ? bestKey : null;
}

/**
 * Calcula a sequência (streak) de dias consecutivos com pelo menos um
 * registro a partir do último dia ativo, com tolerância de 1 dia.
 *
 * Regra: se o último log foi hoje OU ontem, contar a partir dele e voltar
 * dia a dia até encontrar um "buraco". Se foi há mais de 1 dia, a streak é 0.
 *
 * @param dates - Datas dos logs do paciente (ordem irrelevante).
 * @returns Quantidade de dias consecutivos.
 */
function calculateStreak(dates: Date[]): number {
  if (dates.length === 0) return 0;

  const dayKeys = new Set(
    dates.map((d) => startOfDay(d).toISOString().slice(0, 10)),
  );

  const today = startOfDay(new Date());
  const yesterday = startOfDay(subDays(today, 1));
  let cursor: Date | null = null;

  if (dayKeys.has(today.toISOString().slice(0, 10))) {
    cursor = today;
  } else if (dayKeys.has(yesterday.toISOString().slice(0, 10))) {
    cursor = yesterday;
  }

  let streak = 0;
  while (cursor && dayKeys.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor = subDays(cursor, 1);
  }

  return streak;
}

