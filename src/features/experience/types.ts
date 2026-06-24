export interface Experience {
  id: string;
  type: string;
  period: string;
  title: string;
  content: string;
}

export interface UpdateExperienceData {
  type?: string;
  period?: string;
  title?: string;
  content?: string;
}
