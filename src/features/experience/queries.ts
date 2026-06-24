'use client';

import {
  deleteExperience,
  getExperienceList,
  updateExperience,
} from '@/features/experience/actions';
import { UpdateExperienceData } from '@/features/experience/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useGetExperienceList() {
  return useQuery({
    queryKey: ['experienceList'],
    queryFn: () => getExperienceList(),
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { id: string; updateData: UpdateExperienceData }) =>
      updateExperience(data.id, data.updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experienceList'] });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experienceList'] });
    },
  });
}
