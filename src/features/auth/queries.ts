'use client';

import { getUser, deleteUser } from '@/features/auth/actions';
import { useAuthStore } from '@/shared/provider/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
      queryClient.clear();
      setIsLoggedIn(false);
    },
    onError: (error) => {
      console.error('탈퇴 실패:', error);
    },
  });
}
