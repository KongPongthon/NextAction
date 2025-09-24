'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'defaultsecret';
const REFRESH_THRESHOLD = 5 * 60;

export async function requireAuth() {
  //   const token = cookies().get('token')?.value;
  const cookieStore = await cookies(); // ✅ ไม่ต้อง await
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  try {
    const decoded: any = jwt.verify(token, SECRET_KEY, {
      ignoreExpiration: true,
    });
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = decoded.exp - now;

    if (timeLeft <= 0) {
      throw new Error('Token expired');
    }

    // อัปเดต token ถ้าเหลือน้อยกว่า threshold
    if (timeLeft < REFRESH_THRESHOLD) {
      const newToken = jwt.sign(
        { id: decoded.id, email: decoded.email },
        SECRET_KEY,
        {
          expiresIn: '1h',
        }
      );
      cookieStore.set('token', newToken, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
    }

    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
}
