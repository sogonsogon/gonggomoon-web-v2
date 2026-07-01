'use server';

import { CreateStrategyRequest, GetStrategyDetailResponse, GetStrategyListResponse, StrategyResult } from '@/features/strategy/types';
import { ApiResponse } from '@/shared/types/api';
import { privateFetch } from '@/shared/api/http';

//포폴 전략 목록 조회
export async function getStrategyList(): Promise<ApiResponse<GetStrategyListResponse>> {
  const response = await privateFetch<GetStrategyListResponse>('/api/v1/portfolio-strategies')
  return response;
}

//포폴 전략 단건 조회
export async function getStrategy(strategyId: number): Promise<ApiResponse<StrategyResult>> {
  try {
    const response = await privateFetch<GetStrategyDetailResponse>(
      `/api/v1/portfolio-strategies/${strategyId}`,
      {
        cache: 'no-store',
      },
    );
    return response;
  } catch (error) {
    const code = getFailureCode(error);
    const message = getFailureMessage(error);

    if (code === 'PORTFOLIO_STRATEGY_RESULT_NOT_READY') {
      return {
        success: false,
        code,
        message,
      } as ApiResponse<GetStrategyDetailResponse>;
    }

    throw error;
  }
}

// 포폴 전략 생성
export async function createStrategy(payload: CreateStrategyRequest): Promise<ApiResponse<{ strategyId: number }>> {
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


type ApiFailureLike = {
  response?: {
    bodyJson?: {
      code?: string;
      message?: string;
    };
  };
};

function getFailureCode(error: unknown): string | undefined {
  if (typeof error === 'object' && error !== null) {
    return (error as ApiFailureLike).response?.bodyJson?.code;
  }
  return undefined;
}

function getFailureMessage(error: unknown): string {
  if (typeof error === 'object' && error !== null) {
    return (
      (error as ApiFailureLike).response?.bodyJson?.message ??
      (error as { message?: string }).message ??
      '알 수 없는 오류가 발생했습니다.'
    );
  }
  return '알 수 없는 오류가 발생했습니다.';
}
