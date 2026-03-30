import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url || url === "postgresql://user:password@localhost:5432/fundbd") {
    // No real database — return a client that will fail gracefully at query time
    // API routes already catch errors and fall back to mock data
    const adapter = new PrismaPg({ connectionString: url || "postgresql://localhost:5432/fundbd" });
    // @ts-ignore
    return new PrismaClient({ adapter });
  }
  const adapter = new PrismaPg({ connectionString: url });
  // @ts-ignore
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
