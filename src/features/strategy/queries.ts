'use client';

import { deleteStrategy, getStrategy, getStrategyList } from '@/features/strategy/actions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const strategyKeys = {
  all: ['strategy'] as const,
  list: () => [...strategyKeys.all, 'list'] as const,
  detail: (id: string) => [...strategyKeys.all, 'detail', id] as const,
};

// 포폴 전략 목록 조회
const strategyListQueryOptions = () => ({
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

export function useGetStrategyList() {
  return useQuery(strategyListQueryOptions());
}

// 포폴 전략 상세 조회
const getStrategyQueryOption = (id: string) => ({
  queryKey: strategyKeys.detail(id),
  queryFn: async () => {
    const response = await getStrategy(id);
    if (!response.success) {
      return Promise.reject(response);
    }
    return response.data;
  },
  staleTime: 24 * 60 * 60 * 1000,
  gcTime: 24 * 60 * 60 * 1000,
});

export function useGetStrategy(id: string) {
  return useQuery(getStrategyQueryOption(id));
}

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
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: strategyKeys.list() });
      queryClient.removeQueries({ queryKey: strategyKeys.detail(id), exact: true });
    }, //삭제 후 캐시 정리는 useDeleteStrategy의 책임으로 => 사이드바 말고 다른 곳에서 전략 삭제시 ,동일하게 상세 캐시 제거 하도록
  });
}
