'use server';

import { Strategy, StrategyResult } from '@/features/strategy/types';
import { ApiResponse } from '@/shared/types/api';
import { MOCK_STRATEGY_RESULT } from '@/features/strategy/constants/mock';
import { MOCK_RECENT_STRATEGIES } from '@/features/strategy/constants/mock';

//포폴 전략 목록 조회
export async function getStrategyList(): Promise<ApiResponse<Strategy[]>> {
  return {
    success: true,
    code: 'SUCCESS',
    message: '',
    data: MOCK_RECENT_STRATEGIES,
  };
}

//포폴 전략 단건 조회
export async function getStrategy(id: string): Promise<ApiResponse<StrategyResult>> {
  return {
    success: true,
    code: 'SUCCESS',
    message: '',
    data: MOCK_STRATEGY_RESULT,
  };
}

//포폴 전략 삭제
export async function deleteStrategy(id: string): Promise<ApiResponse<null>> {
  return {
    success: true,
    code: 'SUCCESS',
    message: '',
    data: null,
  };
}
