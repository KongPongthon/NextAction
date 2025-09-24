'use server';

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'defaultsecret';
const REFRESH_THRESHOLD = 5 * 60;

export class AuthService {
  async requireAuth() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) throw new Error('Unauthorized');

    try {
      const decoded: any = jwt.verify(token, SECRET_KEY, {
        ignoreExpiration: true,
      });
      const now = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - now;

      if (timeLeft <= 0) throw new Error('Token expired');

      if (timeLeft < REFRESH_THRESHOLD) {
        const newToken = jwt.sign(
          { id: decoded.id, email: decoded.email },
          SECRET_KEY,
          { expiresIn: '1h' }
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
    } catch {
      throw new Error('Invalid token');
    }
  }

  async logout() {
    const cookieStore = await cookies();
    cookieStore.set('token', '', { maxAge: -1, path: '/' });
  }

  // คุณอาจใส่ login() หรือ refreshToken() ไว้ตรงนี้ก็ได้
}
