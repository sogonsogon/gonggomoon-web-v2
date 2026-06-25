'use server';

import type { Experience } from '@/features/experience/types';
import { MOCK_EXPERIENCES } from '@/features/experience/constants/mock';
import { ApiResponse } from '@/shared/types/api';

// 경험 조회
export async function getExperienceList(): Promise<ApiResponse<Experience[]>> {
  return {
    success: true,
    code: 'SUCCESS',
    message: '',
    data: MOCK_EXPERIENCES,
  };
}

// TODO: 경험 등록 create
export async function createExperience(
  data: Omit<Experience, 'id'>,
): Promise<ApiResponse<Experience>> {
  const newExperience: Experience = {
    id: (MOCK_EXPERIENCES.length + 1).toString(),
    ...data,
  };
  return {
    success: true,
    code: 'SUCCESS',
    message: '',
    data: newExperience,
  };
}

//경험 수정
export async function updateExperience(
  id: string,
  data: Omit<Experience, 'id'>,
): Promise<ApiResponse<Experience>> {
  const existing = MOCK_EXPERIENCES.find((exp) => exp.id === id);
  if (!existing)
    return {
      success: false,
      code: 'NOT_FOUND',
      message: '경험을 찾을 수 없습니다.',
      data: null,
    };
  return {
    success: true,
    code: 'SUCCESS',
    message: '',
    data: {
      id,
      ...data,
    },
  };
}

//경험 삭제
export async function deleteExperience(id: string): Promise<ApiResponse<null>> {
  return {
    success: true,
    code: 'SUCCESS',
    message: '',
    data: null,
  };
}
