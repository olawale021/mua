import { prisma } from "@/lib/db";

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function getCached<T>(key: string): Promise<T | null> {
  const entry = await prisma.sephoraCache.findUnique({ where: { id: key } });
  if (entry && entry.expiresAt > new Date()) {
    return entry.data as T;
  }
  return null;
}

export async function setCache(key: string, data: unknown): Promise<void> {
  await prisma.sephoraCache.upsert({
    where: { id: key },
    update: {
      data: data as object,
      expiresAt: new Date(Date.now() + CACHE_TTL),
    },
    create: {
      id: key,
      data: data as object,
      expiresAt: new Date(Date.now() + CACHE_TTL),
    },
  });
}
