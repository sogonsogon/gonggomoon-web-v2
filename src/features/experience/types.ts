export type ExperienceType = 'CAREER' | 'PROJECT' | 'EDUCATION' | 'COMPETITION' | 'OTHER';

export type Experience = {
  experienceId: number;
  title: string;
  experienceType: ExperienceType;
  experienceContent?: string;
  startDate: string;
  endDate: string | null;
};

// 경험 목록 조회
export type GetExperienceListResponse = {
  totalCount: number;
  contents: Experience[];
};

// 경험 생성
export type CreateExperienceRequest = {
  title: string;
  experienceType: ExperienceType;
  experienceContent?: string;
  startDate: string | null;
  endDate: string | null;
};

// 경험 수정
export type UpdateExperienceRequest = {
  experienceId: number;
  payload: {
    title: string;
    experienceType: ExperienceType;
    experienceContent?: string;
    startDate: string | null;
    endDate: string | null;
  };
};

export type UpdateExperienceResponse = Experience;

export type StartExtractExperienceResponse = {
  extractionId: number;
};

// 경험 추출 가능 여부 조회
// export type GetExtractionAvailabilityResponse = {
//   usedCount: number;
//   limitCount: number;
//   canGenerate: boolean;
//   canRetry: boolean;
// };
