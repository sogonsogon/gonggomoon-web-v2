'use client';

import {
  createExperience,
  deleteExperience,
  getExperienceList,
  updateExperience,
} from '@/features/experience/actions';
import { CreateExperienceRequest, UpdateExperienceRequest } from '@/features/experience/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const experienceKeys = {
  all: ['experiences'] as const,
  list: () => [...experienceKeys.all, 'list'] as const,
};

export const experienceListQueryOptions = () => ({
  queryKey: experienceKeys.all,
  queryFn: async () => {
    const result = await getExperienceList();
    if (!result.success) {
      return Promise.reject(result);
    }
    return result.data;
  },
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
});

// 경험 목록 조회
export function useGetExperienceList() {
  return useQuery(experienceListQueryOptions());
}

// 경험 등록
export function useCreateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExperienceRequest) => {
      const result = await createExperience(data);
      if (!result.success) {
        return Promise.reject(result);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.all });
    },
  });
}

// 경험 수정
export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ experienceId, payload }: UpdateExperienceRequest) => {
      const result = await updateExperience({ experienceId, payload });
      if (!result.success) {
        return Promise.reject(result);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.all });
    },
  });
}

// 경험 삭제
export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (experienceId: number) => {
      const result = await deleteExperience({ experienceId });
      if (!result.success) {
        return Promise.reject(result);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.all });
    },
  });
}

// 경험 추출 시작
export function useStartExtractExperience() {}

// 경험 추출 단일 조회
export function useGetExtractedExperienceResponse() {}

// 경험 추출 가능 여부 조회
export function useGetExtractionAvailabilityResponse() {}
