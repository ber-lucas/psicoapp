import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

/**
 * Instância global do PrismaClient.
 * Em ambiente de desenvolvimento, utiliza `globalForPrisma` para evitar múltiplos
 * instanciamentos durante o Hot Module Replacement (HMR) do Next.js, 
 * o que poderia esgotar o pool de conexões do banco de dados.
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"],
    datasourceUrl: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
