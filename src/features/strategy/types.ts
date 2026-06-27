export type StrategyAnalysisCardType = 'summary' | 'list' | 'keywords';

export interface Strategy {
  id: string;
  title: string;
  date: string;
}

export interface StrategyResult {
  createdAt: string;
  jobTitle: string;
  cards: StrategyAnalysisCardData[];
}

export type StrategyAnalysisCardData =
  | {
      id: string;
      order: number;
      type: 'summary';
      title: string;
      content: string;
    }
  | {
      id: string;
      order: number;
      type: 'list';
      title: string;
      items: string[];
    }
  | {
      id: string;
      order: number;
      type: 'keywords';
      title: string;
      keywords: string[];
    };
