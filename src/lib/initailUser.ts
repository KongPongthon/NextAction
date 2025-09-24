import { PrismaClient } from '@prisma/client/extension';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function ensureDefaultUser() {
  const email = 'admin@gmail.com'; // user ที่อยากให้มีแน่ ๆ

  const existing = await prisma.user.findUnique({ where: { email } });
  if (!existing) {
    const hashed = await bcrypt.hash('a', 10);
    await prisma.user.create({
      data: {
        email,
        password: hashed,
      },
    });
    console.log(`✅ Created default user: ${email}`);
  } else {
    console.log(`ℹ️ Default user already exists: ${email}`);
  }
}
