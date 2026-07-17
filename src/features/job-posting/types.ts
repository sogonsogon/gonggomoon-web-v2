export type CreateRecruitmentAnalysisRequest = {
  postUrl: string;
};

export type CreateRecruitmentAnalysisResponse = {
  postId: number;
  url: string;
  status: 'PENDING' | 'SUCCESS';
};

export type JobPostingAnalysis = {
  postId: number;
  postAnalysisId: number;
  title: string;
  summary: {
    title: string;
    summary: string;
    company_intro: string;
    rnr: string[];
    required_skills: string[];
    differentiators: string[];
    hidden_keywords: string[];
  };
};

export type GetRecruitmentAnalysisResponse = JobPostingAnalysis;
