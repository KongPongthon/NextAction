// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

declare global {
  // Prevent multiple instances during hot reload in dev
  // @ts-ignore
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma || new PrismaClient({ log: ['query', 'warn', 'error'] });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
