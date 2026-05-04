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
```

## Design System

### Paleta de Cores (OKLCH)

#### Light Mode (padrão)
- **Primary**: `oklch(0.52 0.22 295)` – Púrpura/Violeta (principal, botões, links)
- **Secondary**: `oklch(0.95 0.04 295)` – Cinza claro (backgrounds secundários)
- **Accent**: `oklch(0.85 0.18 95)` – Amarelo/Verde limão (destaque, CTAs)
- **Destructive**: `oklch(0.577 0.245 27.325)` – Vermelho (erros, delete)
- **Muted**: `oklch(0.96 0.01 270)` – Cinza muito claro (disabled, subtle)
- **Background**: `oklch(0.985 0.005 270)` – Branco quase puro
- **Foreground**: `oklch(0.20 0.03 270)` – Cinza escuro (texto principal)
- **Card**: `oklch(1 0 0)` – Branco puro
- **Border**: `oklch(0.92 0.02 270)` – Cinza claro para bordas
- **Input**: `oklch(0.92 0.02 270)` – Igual à border

#### Dark Mode
- **Primary**: `oklch(0.922 0 0)` – Branco (texto principal)
- **Secondary**: `oklch(0.269 0 0)` – Cinza escuro
- **Background**: `oklch(0.145 0 0)` – Quase preto
- **Card**: `oklch(0.205 0 0)` – Cinza muito escuro
- **Foreground**: `oklch(0.985 0 0)` – Branco

#### Colors de Sidebar
- **Sidebar bg**: `oklch(0.42 0.20 295)` – Púrpura mais escuro
- **Sidebar foreground**: `oklch(0.99 0 0)` – Branco
- **Sidebar primary**: `oklch(0.99 0 0)` (Light) / `oklch(0.488 0.243 264.376)` (Dark)
- **Sidebar accent**: `oklch(0.48 0.20 295)` (Light) / `oklch(0.269 0 0)` (Dark)

#### Colors para Charts
- **Chart 1**: `oklch(0.62 0.20 295)` – Púrpura
- **Chart 2**: `oklch(0.80 0.13 200)` – Azul
- **Chart 3**: `oklch(0.85 0.18 95)` – Verde/Amarelo
- **Chart 4**: `oklch(0.75 0.18 25)` – Laranja
- **Chart 5**: `oklch(0.55 0.22 295)` – Púrpura escuro

#### Hero Gradient
- **From**: `oklch(0.55 0.22 295)` – Púrpura
- **To**: `oklch(0.45 0.20 285)` – Púrpura mais escuro

### Tipografia

- **Font Sans**: Geist Sans (variável do Next.js)
- **Font Mono**: Geist Mono (código)
- **Font Heading**: Sans (reutiliza a fonte body)
- **Line Height**: Padrão Tailwind

### Espaçamento e Border Radius

- **Base Radius**: `1rem` (16px)
  - `--radius-sm`: `0.6rem` (9.6px)
  - `--radius-md`: `0.8rem` (12.8px)
  - `--radius-lg`: `1rem` (16px) – padrão
  - `--radius-xl`: `1.4rem` (22.4px)
  - `--radius-2xl`: `1.8rem` (28.8px)
  - `--radius-3xl`: `2.2rem` (35.2px)
  - `--radius-4xl`: `2.6rem` (41.6px)

### Componentes UI (shadcn/ui)

Componentes disponíveis e configurados:
- Button, Input, Card, Label, Tabs, Table
- Textarea, Select, Popover, Calendar, Dialog
- Avatar, Badge, Separator, Scroll Area
- Dropdown Menu, Sheet, Skeleton
- Sonner (toast notifications)

Todos os componentes herdam automaticamente as cores do Design System via CSS variables.

### Implementação

- **Sistema CSS**: Tailwind CSS com @theme customization
- **Cores**: Usando variáveis CSS (--primary, --secondary, etc)
- **Dark Mode**: Suportado via classe `.dark` na raiz HTML
- **Animações**: tw-animate-css para animações adicionais
