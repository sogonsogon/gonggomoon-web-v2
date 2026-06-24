'use client';

import {
  deleteExperience,
  getExperienceList,
  updateExperience,
} from '@/features/experience/actions';
import { UpdateExperienceData } from '@/features/experience/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const experienceKeys = {
  all: ['experiences'] as const,
  detail: (id: string) => [...experienceKeys.all, id] as const,
};

export const experienceListQueryOptions = () => ({
  queryKey: experienceKeys.all,
  queryFn: () => getExperienceList(),
  staleTime: 10 * 60 * 1000,
  gcTime: 30 * 60 * 1000,
});

// 경험 목록 조회
export function useGetExperienceList() {
  return useQuery(experienceListQueryOptions());
}

// 경험 수정
export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; updateData: UpdateExperienceData }) =>
      updateExperience(data.id, data.updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.all });
    },
  });
}

// 경험 삭제
export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: experienceKeys.all });
    },
  });
}
