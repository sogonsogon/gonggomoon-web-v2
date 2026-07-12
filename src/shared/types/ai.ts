export const AI_JOB_TYPES = [
  'EXTRACT_EXPERIENCE',
  'PORTFOLIO_STRATEGY',
  'INTERVIEW_STRATEGY',
  'RECRUITMENT_ANALYSIS',
] as const;

export type AiJobType = (typeof AI_JOB_TYPES)[number];

export type AiJobSubscribeTarget = {
  type: AiJobType;
  id: string | number;
};

export type AiJobSseEventType = 'failed' | 'already_finished' | 'ai-job-status';

export type AiJobStatus = 'READY' | 'PROCESSING' | 'FAILED';

export type AiJobStatusPayload = {
  id?: string | number;
  type?: AiJobType;
  status: AiJobStatus;
  code?: string;
  message?: string;
};

export type AiJobSseFailurePayload = {
  status?: number;
  code?: string;
  message: string;
};

export type AiJobSseAlreadyFinishedPayload = {
  id: string;
  type: AiJobType;
};

export function isAiJobType(value: string | null): value is AiJobType {
  return AI_JOB_TYPES.some((type) => type === value);
}
