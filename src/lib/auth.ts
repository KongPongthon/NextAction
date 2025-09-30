'use server';

import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Prisma } from './prisna';
import { ServiceError } from './ServiceErrors';

const SECRET_KEY = process.env.JWT_SECRET_KEY ?? 'defaultsecret';
const REFRESH_THRESHOLD = 5 * 60; // 5 นาที

// เรานิยาม payload ของเราเอง
interface AppJwtPayload extends JwtPayload {
  id: string;
  email: string;
}

export async function verifyToken() {
  const getToken = await cookies();
  const token = getToken.get('token')?.value;

  if (!token) {
    throw new ServiceError(401, 'Token not found');
  }
  const decoded = jwt.verify(token, SECRET_KEY) as AppJwtPayload;

  if (!decoded.exp) {
    throw new ServiceError(401, 'Token has no expiration');
  }
  const now = Math.floor(Date.now() / 1000); // ปัจจุบัน (วินาที)
  const timeLeft = decoded.exp - now;
  console.log('timeLeft', timeLeft, 'REFRESH_THRESHOLD', REFRESH_THRESHOLD);

  if (timeLeft < REFRESH_THRESHOLD) {
    const token = jwt.sign(
      { email: decoded.email, role: 'admin' },
      SECRET_KEY,
      {
        expiresIn: REFRESH_THRESHOLD,
      }
    );

    getToken.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    });
  }
  const user = await Prisma.user.findUnique({
    where: {
      email: decoded.email,
    },
    include: {
      detailUser: true,
    },
  });
  if (user && user.detailUser) {
    return user.detailUser.id;
  } else {
    throw new ServiceError(404, 'User not found');
  }
}
