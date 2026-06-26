'use client';

import { deleteStrategy, getStrategy, getStrategyList } from '@/features/strategy/actions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const strategyKeys = {
  all: ['strategy'] as const,
  list: () => [...strategyKeys.all, 'list'] as const,
  detail: (id: string) => [...strategyKeys.all, 'detail', id] as const,
  availability: () => [...strategyKeys.all, 'availability'] as const,
};

//질문, id 인지 - strategyId 인지?
// 포폴 전략 목록 조회
export function useGetStrategyList() {
  return useQuery(strategyListQueryOptions());
}

export const strategyListQueryOptions = () => ({
  queryKey: strategyKeys.list(),
  queryFn: async () => {
    const result = await getStrategyList();
    if (!result.success) {
      return Promise.reject(result);
    }
    return result.data;
  },
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
});

// 포폴 전략 상세 조회
export function useGetStrategy(id: string) {
  return useQuery(getStrategyQueryOption(id));
}

export const getStrategyQueryOption = (id: string) => ({
  queryKey: strategyKeys.detail(id),
  queryFn: async () => {
    const response = await getStrategy(id);
    if (!response.success) {
      return Promise.reject(response);
    }
    return response.data;
  },
  staleTime: 60 * 1000,
  enabled: !!id,
  retry: false,
});

// 포폴 전략 삭제
export function useDeleteStrategy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteStrategy(id);
      if (!result.success) {
        return Promise.reject(result);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: strategyKeys.list() });
    },
  });
}
