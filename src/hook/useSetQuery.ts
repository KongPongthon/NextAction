'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useSetQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    updates: Record<string, string | number | null | undefined>,
    options?: { replace?: boolean }
  ) => {
    const params = new URLSearchParams(searchParams); // clone ปัจจุบัน
    Object.entries(updates).forEach(([k, v]) => {
      if (v === '' || v === null || v === undefined) {
        params.delete(k);
      } else {
        params.set(k, String(v));
      }
    });
    const url = `${pathname}?${params.toString()}`;
    options?.replace ? router.replace(url) : router.push(url);
  };
}
