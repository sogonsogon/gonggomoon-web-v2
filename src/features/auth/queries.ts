'use client';

import { getUser, deleteUser, logout } from '@/features/auth/actions';
import { isProtectedRoute } from '@/shared/constants/protectedRoutes';
import { useAuthStore } from '@/shared/provider/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';

export const userQueryOptions = () => ({
  queryKey: ['user'],
  queryFn: async () => {
    const result = await getUser();
    if (!result.success) {
      return Promise.reject(result);
    }
    return result.data;
  },
  staleTime: Infinity,
  gcTime: 1000 * 60 * 60 * 24,
});

// 회원 정보 조회
export function useGetUser(options?: { enabled?: boolean }) {
  return useQuery({ ...userQueryOptions(), enabled: options?.enabled });
}

// 회원 탈퇴
export function useDeleteUser() {
  const queryClient = useQueryClient();
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);

  return useMutation({
    mutationFn: () => deleteUser(),
    onSuccess: () => {
      setIsLoggedIn(false);
      queryClient.clear();
    },
    onError: (error) => {
      console.error('탈퇴 실패:', error);
    },
  });
}

//로그아웃
export function useLogout() {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  return useMutation({
    mutationFn: async () => {
      queryClient.clear();
      if (isProtectedRoute(pathname)) router.replace('/');
      await logout();
      setIsLoggedIn(false);
    },
  });
}
