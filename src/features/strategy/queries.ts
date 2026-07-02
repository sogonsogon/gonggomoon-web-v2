'use client';

import {
  createStrategy,
  deleteStrategy,
  getStrategy,
  getStrategyList,
} from '@/features/strategy/actions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreateStrategyRequest } from './types';

const strategyKeys = {
  all: ['strategy'] as const,
  list: () => [...strategyKeys.all, 'list'] as const,
  detail: (strategyId: number) => [...strategyKeys.all, 'detail', strategyId] as const,
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
const getStrategyQueryOption = (strategyId: number) => ({
  queryKey: strategyKeys.detail(strategyId),
  queryFn: async () => {
    const response = await getStrategy(strategyId);
    if (!response.success) {
      return Promise.reject(response);
    }
    return response.data;
  },
  staleTime: 24 * 60 * 60 * 1000,
  gcTime: 24 * 60 * 60 * 1000,
});

export function useGetStrategy(strategyId: number) {
  return useQuery(getStrategyQueryOption(strategyId));
}

// 포폴 전략 생성
export function useCreateStrategy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateStrategyRequest) => {
      const result = await createStrategy(payload);

      if (!result.success) {
        return Promise.reject(result);
      }

      return result.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: strategyKeys.list() });
      queryClient.invalidateQueries({
        queryKey: strategyKeys.detail(data.strategyId),
      });
    },
    onError: (error) => {
      console.error('포폴 전략 생성 실패:', error);
    },
  });
}

// 포폴 전략 삭제
export function useDeleteStrategy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (strategyId: number) => {
      const result = await deleteStrategy(strategyId);
      if (!result.success) {
        return Promise.reject(result);
      }
      return result.data;
    },
    onSuccess: (_data, strategyId) => {
      queryClient.invalidateQueries({ queryKey: strategyKeys.list() });
      queryClient.removeQueries({ queryKey: strategyKeys.detail(strategyId), exact: true });
    }, //삭제 후 캐시 정리는 useDeleteStrategy의 책임으로 => 사이드바 말고 다른 곳에서 전략 삭제시 ,동일하게 상세 캐시 제거 하도록
  });
}
