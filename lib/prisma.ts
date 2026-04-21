import { PrismaClient } from "@prisma/client";

function ensurePooledConnectionUrl() {
  const current = process.env.DATABASE_URL;
  if (!current) {
    return;
  }

  try {
    const parsed = new URL(current);
    if (!parsed.searchParams.has("pgbouncer")) {
      parsed.searchParams.set("pgbouncer", "true");
    }
    if (!parsed.searchParams.has("connect_timeout")) {
      parsed.searchParams.set("connect_timeout", "10");
    }
    process.env.DATABASE_URL = parsed.toString();
  } catch {
    // Keep original DATABASE_URL when parsing fails.
  }
}

ensurePooledConnectionUrl();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
