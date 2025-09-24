'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Prisma } from '@/lib/prisna';
import { loginSchema } from '@/schema/login';
const SECRET_KEY = process.env.JWT_SECRET_KEY as string;

export async function loginAction(formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const parsed = loginSchema.safeParse(data);
    console.log('Test parsed', parsed);

    if (!parsed.success) {
      return { success: false, error: 'Invalid input' };
    }

    const { email, password } = parsed.data;

    // TODO: check database or auth service
    //   if (email === 'test@example.com' && password === '123456') {
    //     return { success: true };
    //   }

    const user = await Prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
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
    console.log('Test', user, isValid);

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
    console.log('token', token);

    return { success: true };
  } catch (e) {
    console.log(e);
    return { success: false, error: 'Internal server error' };
  }
}
