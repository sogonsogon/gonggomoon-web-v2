'use server';

import type { Experience, UpdateExperienceData } from '@/features/experience/types';
import { MOCK_EXPERIENCES } from '@/features/experience/constants/mock';

export async function getExperienceList(): Promise<Experience[]> {
  return MOCK_EXPERIENCES;
}

export async function updateExperience(
  id: string,
  data: UpdateExperienceData,
): Promise<Experience> {
  const existing = MOCK_EXPERIENCES.find((exp) => exp.id === id);
  if (!existing) throw new Error('경험을 찾을 수 없습니다.');
  return { ...existing, ...data };
}

export async function deleteExperience(_id: string): Promise<void> {
  return;
}
