'use server';

import { cookies } from 'next/headers';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client/extension';
import bcrypt from 'bcrypt';
const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function loginAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const parsed = loginSchema.safeParse(data);
    const prisma = new PrismaClient();

    if (!parsed.success) {
      return { success: false, error: 'Invalid input' };
    }

    const { email, password } = parsed.data;

    // TODO: check database or auth service
    //   if (email === 'test@example.com' && password === '123456') {
    //     return { success: true };
    //   }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    // เช็ค password hash
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, error: 'Invalid credentials' };
    }

    const cookiesPromise = cookies();
    const getcookies = await cookiesPromise;
    const token = jwt.sign({ email, role: 'admin' }, SECRET_KEY, {
      expiresIn: '1h',
    });

    getcookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });

    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false, error: 'Internal server error' };
  }
}
