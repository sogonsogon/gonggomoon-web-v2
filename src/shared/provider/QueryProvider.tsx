'use client';

import type { ApiErrorResponse } from '@/shared/types/api';
import { useAuthStore } from '@/shared/provider/AuthProvider';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const handleSessionExpired = () => {
    setIsLoggedIn(false);
    router.replace('/');
  };
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            if (isSessionExpiredError(error)) {
              handleSessionExpired();
            }
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (isSessionExpiredError(error)) {
              handleSessionExpired();
            }
          },
        }),
        defaultOptions: {
          queries: {
            retry: (failureCount, error) =>
              !isSessionExpiredError(error) && failureCount < 1,
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

function isSessionExpiredError(error: unknown): error is ApiErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'success' in error &&
    error.success === false &&
    'code' in error &&
    error.code === 'SESSION_EXPIRED'
  );
}
