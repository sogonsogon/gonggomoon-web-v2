export type CreateRecruitmentAnalysisRequest = {
  postUrl: string;
};

export type CreateRecruitmentAnalysisResponse = {
  postId: string;
  url: string;
  status: 'PENDING' | 'SUCCESS';
};

export type JobPostingAnalysis = {
  postId: string;
  postAnalysisId: string;
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
