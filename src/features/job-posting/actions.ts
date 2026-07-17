'use server';

import { privateFetch } from '@/shared/api/http';
import type { ApiResponse } from '@/shared/types/api';
import type {
  CreateRecruitmentAnalysisRequest,
  CreateRecruitmentAnalysisResponse,
  GetRecruitmentAnalysisResponse,
} from '@/features/job-posting/types';

export async function createRecruitmentAnalysis(
  payload: CreateRecruitmentAnalysisRequest,
): Promise<ApiResponse<CreateRecruitmentAnalysisResponse>> {
  const response = await privateFetch<CreateRecruitmentAnalysisResponse>('/api/v1/posts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
}

export async function getRecruitmentAnalysis(
  postAnalysisId: number,
): Promise<ApiResponse<GetRecruitmentAnalysisResponse>> {
  return privateFetch<GetRecruitmentAnalysisResponse>(`/api/v1/posts/${postAnalysisId}`, {
    cache: 'no-store',
  });
}
