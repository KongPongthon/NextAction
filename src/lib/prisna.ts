import { PrismaClient } from '../../generated/prisma';

declare global {
  // ป้องกัน multiple instance ตอน hot reload (dev only)
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const Prisma =
  global.prisma || new PrismaClient({ log: ['query', 'warn', 'error'] });

if (process.env.NODE_ENV !== 'production') {
  global.prisma = Prisma;
}
