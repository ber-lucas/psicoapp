"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";

/**
 * Realiza o login do usuário utilizando Supabase Auth.
 * 
 * @param formData - Dados do formulário contendo 'email' e 'password'.
 * @returns Redireciona para o painel do paciente em caso de sucesso.
 * @throws Redireciona de volta para '/login' com mensagem de erro caso as credenciais sejam inválidas.
 */
export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect("/login?error=" + encodeURIComponent(error.message));
  }

  // Depois do login, redireciona pro dashboard principal (o middleware cuida do resto se precisar)
  return redirect("/patient/dashboard");
}

/**
 * Registra um novo usuário na plataforma (Paciente ou Psicólogo).
 * Verifica o código de convite para definir a 'role' (PSYCHOLOGIST vs PATIENT) e os vínculos.
 * Sincroniza a criação da conta entre o Supabase Auth e o banco de dados via Prisma.
 * 
 * @param formData - Dados do formulário contendo 'name', 'email', 'password' e 'inviteCode'.
 * @returns Redireciona para o dashboard respectivo da 'role' do usuário criado.
 * @throws Redireciona para '/login' com erro se o código de convite for inválido, se a criação falhar no Supabase ou no Prisma.
 */
export async function signup(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const inviteCode = formData.get("inviteCode") as string | null;

  if (!inviteCode || inviteCode.trim() === "") {
    return redirect("/login?error=" + encodeURIComponent("Código de convite é obrigatório."));
  }

  let role: "PSYCHOLOGIST" | "PATIENT" = "PATIENT";
  let psychologistId: string | null = null;
  let doctorCode: string | null = null;

  if (inviteCode === "PSICO2026") {
    role = "PSYCHOLOGIST";
    // Gera um código único de 6 caracteres para o psicólogo (ex: DR-A1B2C3)
    doctorCode = "DR-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  } else {
    // Busca o psicólogo no banco pelo código fornecido
    const psychologist = await prisma.user.findUnique({
      where: { doctorCode: inviteCode },
    });

    if (!psychologist || psychologist.role !== "PSYCHOLOGIST") {
      return redirect("/login?error=" + encodeURIComponent("Código de convite inválido ou psicólogo não encontrado."));
    }

    role = "PATIENT";
    psychologistId = psychologist.id;
  }

  const supabase = await createClient();

  // 1. Criar o usuário no Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return redirect("/login?error=" + encodeURIComponent(error.message));
  }

  if (data.user) {
    try {
      // 2. Criar o usuário no nosso banco de dados já com as relações corretas
      await prisma.user.create({
        data: {
          id: data.user.id, // Sincroniza o ID do Supabase com o nosso Banco
          name,
          email,
          role,
          doctorCode,
          psychologistId,
        },
      });
    } catch (dbError) {
      console.error("Erro ao criar usuário no banco:", dbError);
      return redirect("/login?error=" + encodeURIComponent("Erro interno no servidor ao criar conta."));
    }
  }

  // Redireciona de acordo com o perfil recém criado
  return redirect(role === "PSYCHOLOGIST" ? "/psychologist/dashboard" : "/patient/dashboard");
}

/**
 * Encerra a sessão atual do usuário no Supabase.
 * 
 * @returns Redireciona para a tela de '/login'.
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  return redirect("/login");
}
