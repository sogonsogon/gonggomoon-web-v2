import { GenerationStatus } from '@/shared/types/generation';

export type StrategyStatus = GenerationStatus | 'DRAFT';

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
  postAnalysisId: number;
  postAnalysisTitle: string;
  status: StrategyStatus;
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
  postAnalysisId: number;
  postAnalysisTitle: string;
  selectedExperienceCount: number;
  createdAt: string;
  mainPositioningMessage: string;
  improvementGuides: StrategyImprovementGuide[];
  experienceStrategyPoints: StrategyExperiencePoint[];
  experienceOrdering: StrategyExperienceOrdering[];
  keywords: string[];
  strengths: string[];
  kpiCheckList: string[];
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
