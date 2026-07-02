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
  title: string;
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
  postAnalysisId: number;
  experienceIds: number[];
};
