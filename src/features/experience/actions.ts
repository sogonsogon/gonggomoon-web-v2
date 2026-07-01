'use server';

import type {
  CreateExperienceRequest,
  GetExperienceListResponse,
  GetExtractedExperienceResponse,
  GetExtractionAvailabilityResponse,
  StartExtractExperienceResponse,
  UpdateExperienceRequest,
  UpdateExperienceResponse,
} from '@/features/experience/types';
import { ApiResponse } from '@/shared/types/api';
import { privateFetch } from '@/shared/api/http';

// 경험 조회
export async function getExperienceList(): Promise<ApiResponse<GetExperienceListResponse>> {
  const response = await privateFetch<GetExperienceListResponse>('/api/v1/experiences');
  return response;
}

//경험 등록
export async function createExperience(
  payload: CreateExperienceRequest,
): Promise<ApiResponse<{ experienceId: number }>> {
  const response = await privateFetch<{ experienceId: number }>(`/api/v1/experiences`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
}

//경험 수정
export async function updateExperience({
  experienceId,
  payload,
}: UpdateExperienceRequest): Promise<ApiResponse<UpdateExperienceResponse>> {
  const response = await privateFetch<UpdateExperienceResponse>(
    `/api/v1/experiences/${experienceId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(payload),
    },
  );
  return response;
}

// 경험 삭제
export async function deleteExperience({
  experienceId,
}: { experienceId: number }): Promise<ApiResponse<null>> {
  const response = await privateFetch<null>(`/api/v1/experiences/${experienceId}`, {
    method: 'DELETE',
  });
  return response;
}

// 경험 추출 시작
export async function startExtractExperience(
  payload: { fileAssetIds: number[] },
): Promise<ApiResponse<StartExtractExperienceResponse>> {
  const response = await privateFetch<StartExtractExperienceResponse>(
    '/api/v1/experiences/extractions',
    {
      method: 'POST',
      body: JSON.stringify(payload),
      cache: 'no-store',
    },
  );
  return response;
}

// 경험 추출 단건 조회
export async function getExtractedExperience(
  extractionId: number,
): Promise<ApiResponse<GetExtractedExperienceResponse>> {
  const response = await privateFetch<GetExtractedExperienceResponse>(
    `/api/v1/experiences/extractions/${extractionId}`,
  );
  return response;
}

// 경험 추출 가능 여부 조회
export async function getExtractionAvailability(): Promise<
  ApiResponse<GetExtractionAvailabilityResponse>
> {
  const response = await privateFetch<GetExtractionAvailabilityResponse>(
    '/api/v1/experiences/extractions/availability',
  );
  return response;
}
