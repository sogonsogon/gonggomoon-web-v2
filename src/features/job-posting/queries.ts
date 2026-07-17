'use client';

import * as React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createRecruitmentAnalysis, getRecruitmentAnalysis } from '@/features/job-posting/actions';
import type { CreateRecruitmentAnalysisRequest } from '@/features/job-posting/types';
import {
  strategyKeys,
  strategyListQueryOptions,
} from '@/features/strategy/queries';

export const jobPostingKeys = {
  all: ['job-posting'] as const,
  detail: (postId: number) => [...jobPostingKeys.all, 'detail', postId] as const,
};

export const recruitmentAnalysisQueryOptions = (postAnalysisId: number) => ({
  queryKey: jobPostingKeys.detail(postAnalysisId),
  queryFn: async () => {
    const result = await getRecruitmentAnalysis(postAnalysisId);

    if (!result.success) {
      return Promise.reject(result);
    }

    return result.data;
  },
  staleTime: 24 * 60 * 60 * 1000,
  gcTime: 24 * 60 * 60 * 1000,
});

export function useCreateRecruitmentAnalysis() {
  return useMutation({
    mutationFn: async (payload: CreateRecruitmentAnalysisRequest) => {
      const result = await createRecruitmentAnalysis(payload);
      if (!result.success) {
        return Promise.reject(result);
      }
      return result.data;
    },
  });
}

export function useGetRecruitmentAnalysis(postAnalysisId: number) {
  return useQuery({
    ...recruitmentAnalysisQueryOptions(postAnalysisId),
    enabled: Number.isFinite(postAnalysisId) && postAnalysisId > 0,
  });
}

export function useFetchRecruitmentAnalysisByStrategyId() {
  const queryClient = useQueryClient();

  return React.useCallback(
    async (strategyId: number) => {
      await queryClient.invalidateQueries({ queryKey: strategyKeys.list() });

      const strategyData = await queryClient.fetchQuery(strategyListQueryOptions());
      const strategy = strategyData.contents.find((item) => item.strategyId === strategyId);

      if (!strategy || !isPositiveInteger(strategy.postAnalysisId)) {
        throw new Error('공고 분석 정보를 확인하지 못했습니다. 다시 시도해주세요.');
      }

      const { postAnalysisId } = strategy;

      await queryClient.fetchQuery({
        ...recruitmentAnalysisQueryOptions(postAnalysisId),
        staleTime: 0,
      });

      return postAnalysisId;
    },
    [queryClient],
  );
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}
