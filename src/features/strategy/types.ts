import { GenerationStatus } from '@/shared/types/generation';

export type JobType =
  | 'FRONTEND'
  | 'BACKEND'
  | 'EMBEDDED'
  | 'DEVOPS'
  | 'DATA_ANALYSIS'
  | 'AI'
  | 'INFORMATION_SECURITY'
  | 'DESIGN'
  | 'PM_PO'
  | 'QA';

export type Strategy = {
  strategyId: number;
  jobType: JobType;
  industryName: string;
  title: string;
  status?: GenerationStatus;
  createdAt: string;
};

export type StrategyExperiencePoint = {
  experienceType: string;
  experienceTitle: string;
  strategyPoint: string;
};

export type StrategyExperienceOrdering = {
  order: number;
  title: string;
  reason: string;
};

export type StrategyImprovementGuide = {
  title: string;
  description: string;
};

export type StrategyResult = {
  strategyId: number;
  jobType: JobType;
  industryName: string;
  selectedExperienceCount: number;
  createdAt: string;
  mainPositioningMessage: string;
  experienceStrategyPoints: StrategyExperiencePoint[];
  experienceOrdering: StrategyExperienceOrdering[];
  keywords: string[];
  strengths: string[];
  kpiCheckList: string[];
  improvementGuides: StrategyImprovementGuide[];
};

export type GetStrategyDetailResponse = StrategyResult;

export type GetStrategyListResponse = {
  totalCount: number;
  contents: Strategy[];
};

export type CreateStrategyRequest = {
  jobType: JobType; //TODO: 추후 삭제 예정, 현재 요청 테스트용으로 사용
  industryId: number; //TODO: 추후 삭제 예정, 현재 요청 테스트용으로 사용
  postAnalysisId: number;
  experienceIds: number[];
};
