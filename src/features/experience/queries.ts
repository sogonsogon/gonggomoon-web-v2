'use client';

import {
  deleteExperience,
  getExperienceList,
  updateExperience,
} from '@/features/experience/actions';
import { UpdateExperienceRequest } from '@/features/experience/types';
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

// TODO: 경험 등록

// 경험 수정
export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateExperienceRequest) => {
      const result = await updateExperience(id, data);
      if (!result.success) {
        return Promise.reject(result);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.list() });
    },
  });
}

// 경험 삭제
export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteExperience(id);
      if (!result.success) {
        return Promise.reject(result);
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.list() });
    },
  });
}
