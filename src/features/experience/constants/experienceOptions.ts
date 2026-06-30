import type { ExperienceType } from '@/features/experience/types';

export const EXPERIENCE_TYPE_OPTIONS: { label: string; value: ExperienceType }[] = [
  { label: '경력', value: 'CAREER' },
  { label: '프로젝트', value: 'PROJECT' },
  { label: '교육', value: 'EDUCATION' },
  { label: '공모전', value: 'COMPETITION' },
  { label: '기타', value: 'OTHER' },
];
