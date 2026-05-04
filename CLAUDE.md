# Regras Globais do Projeto

## Identidade e Stack
- Atue como um Engenheiro de Software Sênior especializado em TypeScript, Next.js (App Router), Prisma e Supabase.
- Priorize código limpo, modular e tipagem estrita (strict mode).

## Regras do Next.js (App Router)
- Utilize estritamente o paradigma do App Router (`app/`). NUNCA gere código utilizando o Pages Router (`pages/`).
- Por padrão, todos os componentes devem ser Server Components.
- Adicione a diretiva `'use client'` APENAS quando o componente precisar de interatividade (hooks do React como useState, useEffect, eventos de onClick).
- Para mutações de dados (criar, atualizar, deletar), utilize SEMPRE Server Actions no Next.js. Evite criar rotas de API (`app/api/`) a menos que seja para webhooks externos.

## Tratamento de Erros
- Nunca "engula" erros com `try/catch` vazios. Registre os erros e retorne mensagens amigáveis para o Frontend.

## Padrão de Documentação de Código (TSDoc)
- Documente SEMPRE todas as funções exportadas, Server Actions, utilitários, interfaces e componentes complexos utilizando o padrão **TSDoc** (`/** ... */`).
- A documentação deve focar na "Regra de Negócio" e no "Porquê", não apenas em descrever o óbvio que o TypeScript já tipa.
- Utilize as tags padronizadas: `@param` (explicando o contexto do argumento), `@returns` (o que a função devolve) e `@throws` (se a função puder disparar erros de validação ou autorização).

**Exemplo do padrão esperado para a IA seguir:**
```typescript
/**
 * Registra a emoção diária do paciente e vincula ao seu histórico.
 * Verifica a sessão ativa no Supabase antes de realizar a inserção no Prisma.
 * 
 * @param emotion - O sentimento relatado (ex: Ansiedade, Alegria, Frustração).
 * @param notes - Relato opcional em texto livre sobre os gatilhos ou vivências do dia.
 * @returns O objeto do registro recém-criado no banco de dados.
 * @throws Lança erro ('Unauthorized') caso o usuário não esteja autenticado como PATIENT.
 */
export async function createEmotionLog(emotion: string, notes?: string) {
  // ... implementação
}
