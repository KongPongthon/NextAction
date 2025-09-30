'use client';
import Navbar from '@/components/Navbar/Navbar';
import { queryClient } from '@/lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';

export default function LayoutAdmin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='flex h-screen w-screen bg-gray-100'>
      {/* Sidebar (Desktop) */}
      {/* <aside className='hidden md:block w-64 bg-white border-r'> */}
      {/* <Sidebar /> */}
      {/* </aside> */}

      {/* Content */}
      <section className='flex-1 overflow-auto flex flex-col'>
        <Navbar />
        <div className='p-4 flex-1'>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </div>
      </section>

      {/* Footer */}
    </main>
  );
}
