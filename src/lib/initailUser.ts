import bcrypt from 'bcrypt';
import { Prisma } from './prisna';

export async function ensureDefaultUser() {
  const email = 'admin@gmail.com';
  const existing = await Prisma.user.findUnique({ where: { email } });

  if (!existing) {
    const hashed = await bcrypt.hash('a', 10);
    await Prisma.user.create({
      data: {
        email,
        password: hashed,
        detailUser: {
          create: {
            firstName: 'Admin',
            lastName: 'Admin',
            phone: '0000000000',
            status: 'Active',
            position: 'Admin',
            role: 'Admin',
            profilePath: '', // <- ใส่ default ว่างหรือ path ถ้ามี
          },
        },
      },
    });
    console.log(`✅ Created default user: ${email}`);
  } else {
    console.log(`ℹ️ Default user already exists: ${email}`);
  }
}
