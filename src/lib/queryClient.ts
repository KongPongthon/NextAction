// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //   staleTime: 5 * 60 * 1000, // 5 นาที
      //   cacheTime: 30 * 60 * 1000, // 30 นาที
      refetchOnWindowFocus: false,
    },
  },
});
