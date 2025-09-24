'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { loginAction } from '../action/login';
import { loginSchema, LoginSchema } from '@/schema/login';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: LoginSchema) => {
    startTransition(async () => {
      const formData = new FormData();
      console.log(values);

      formData.append('email', values.email);
      formData.append('password', values.password);

      const res = await loginAction(formData);
      console.log(res);

      if (!res.success) {
        setError('password', { message: res.error });
      } else {
        router.push('/admin/dashboard');
      }
    });
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800'>
      <Card className='w-[400px] shadow-2xl border border-gray-700 bg-gray-950/80 backdrop-blur-xl'>
        <CardHeader>
          <CardTitle className='text-center text-2xl text-white'>
            Welcome Back
          </CardTitle>
          <CardDescription className='text-center text-gray-400'>
            Login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            {/* Email */}
            <div className='space-y-1'>
              <label className='text-gray-300 text-sm'>Email</label>
              <Input
                type='email'
                placeholder='you@example.com'
                className='bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-orange-500'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-red-400 text-sm'>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className='space-y-1'>
              <label className='text-gray-300 text-sm'>Password</label>
              <Input
                type='password'
                placeholder='********'
                className='bg-gray-800 text-white border-gray-700 focus:ring-2 focus:ring-orange-500'
                {...register('password')}
              />
              {errors.password && (
                <p className='text-red-400 text-sm'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl'
              disabled={isPending}
            >
              {isPending ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
