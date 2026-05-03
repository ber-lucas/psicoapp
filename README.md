# PsicoApp - Plataforma de Saúde Mental

Este é um MVP para uma plataforma de saúde mental que conecta **Pacientes** e **Psicólogos**.

## Tecnologias e Versões (Últimas Estáveis)
Este projeto utiliza as tecnologias e padrões mais recentes do ecossistema React/Next.js:
- **Next.js**: `16.2.4` (App Router, Server Actions)
- **React**: `19.2.5`
- **Prisma ORM**: `7.8.0` (Usando nova configuração via `prisma.config.ts`)
- **Tailwind CSS**: `v4`
- **Componentes Base**: `shadcn/ui` + `lucide-react`
- **Autenticação**: Supabase Auth (SSR)
- **Banco de Dados**: PostgreSQL (Supabase)

## Funcionalidades Desenvolvidas

1. **Sistema de Autenticação Dupla (Paciente / Psicólogo)**
   - O registro do usuário é feito com base em **Códigos de Convite**.
   - Se o código de convite for o master (`PSICO2026`), a conta é criada como Psicólogo e um código exclusivo de Dr(a) é gerado automaticamente.
   - Se o código de convite for o de um psicólogo existente, a conta é criada como Paciente e vinculada ao profissional correto no banco de dados.

2. **Dashboards Separados**
   - **Painel do Psicólogo**: Exibe o código de convite e uma tabela estilizada com a lista de todos os seus pacientes, incluindo a emoção mais recente registrada e a data do registro.
   - **Painel do Paciente**: Uma interface simples focada no registro diário de emoções (como se está sentindo, anotações de diário), visível para o seu psicólogo.

3. **Arquitetura Sever-Side e TSDoc**
   - Utilização massiva de **Server Components** por padrão e **Server Actions** para mutações (como `login`, `signup`, `logout`), evitando APIs REST locais e trazendo segurança máxima.
   - Código rigorosamente documentado utilizando o padrão **TSDoc**, enfatizando regras de negócio e controle de exceções.

## Setup Local

### Pré-requisitos
- Node.js versão `20` ou superior.
- Uma conta no Supabase com um banco PostgreSQL.

### Instalação
1. Clone este repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Copie o arquivo `.env.example` para `.env` e preencha as suas credenciais do Supabase.
   ```bash
   cp .env.example .env
   ```
4. Gere o Prisma Client com a sua URL local:
   ```bash
   npx prisma generate
   ```
5. Rode a aplicação em modo de desenvolvimento:
   ```bash
   npm run dev
   ```

Acesse [http://localhost:3000](http://localhost:3000) para ver o resultado no navegador.
