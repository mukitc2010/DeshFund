// Lazy-load Prisma client — only connects when actually called
// This prevents build/import failures on Vercel when no DB is available

let _prisma: any = null;

function getPrismaClient() {
  if (_prisma) return _prisma;

  try {
    const { PrismaClient } = require("@/generated/prisma/client");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const url = process.env.DATABASE_URL || "postgresql://localhost:5432/fundbd";
    const adapter = new PrismaPg({ connectionString: url });
    _prisma = new PrismaClient({ adapter });
    return _prisma;
  } catch {
    // Return a proxy that throws readable errors
    return new Proxy({} as any, {
      get: () => new Proxy({} as any, {
        get: () => async () => { throw new Error("DATABASE_NOT_AVAILABLE"); }
      })
    });
  }
}

export const prisma = new Proxy({} as any, {
  get: (_target, prop) => getPrismaClient()[prop],
});
