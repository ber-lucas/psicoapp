"use server";

import { revalidatePath } from "next/cache";
import type { EmotionLog, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireRole, requireUser } from "@/lib/auth";
import { isEmotion } from "@/lib/emotions";

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
