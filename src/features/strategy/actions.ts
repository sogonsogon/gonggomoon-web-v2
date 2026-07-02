'use server';

import {
  CreateStrategyRequest,
  GetStrategyDetailResponse,
  GetStrategyListResponse,
  StrategyResult,
} from '@/features/strategy/types';
import { ApiResponse } from '@/shared/types/api';
import { privateFetch } from '@/shared/api/http';

//포폴 전략 목록 조회
export async function getStrategyList(): Promise<ApiResponse<GetStrategyListResponse>> {
  const response = await privateFetch<GetStrategyListResponse>('/api/v1/portfolio-strategies');
  return response;
}

//포폴 전략 단건 조회
export async function getStrategy(strategyId: number): Promise<ApiResponse<StrategyResult>> {
  const response = await privateFetch<GetStrategyDetailResponse>(
    `/api/v1/portfolio-strategies/${strategyId}`,
    {
      cache: 'no-store',
    },
  );
  return response;
}

// 포폴 전략 생성
export async function createStrategy(
  payload: CreateStrategyRequest,
): Promise<ApiResponse<{ strategyId: number }>> {
  const response = await privateFetch<{ strategyId: number }>(`/api/v1/portfolio-strategies`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
}

//포폴 전략 삭제
export async function deleteStrategy(strategyId: number): Promise<ApiResponse<null>> {
  const response = await privateFetch<null>(`/api/v1/portfolio-strategies/${strategyId}`, {
    method: 'DELETE',
  });
  return response;
}
