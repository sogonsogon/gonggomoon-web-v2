export interface Experience {
  id: string;
  type: string;
  period: string;
  title: string;
  content: string;
}

export type UpdateExperienceRequest = {
  id: string;
  data: Omit<Experience, 'id'>;
};
