export type StrategyStatus = 'READY' | 'PROCESSING' | 'DRAFT' | string;

export type Strategy = {
  strategyId: string;
  postAnalysisId: string;
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
  strategyId: string;
  postAnalysisId: string;
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
  postAnalysisId: string;
  experienceIds: string[];
};
