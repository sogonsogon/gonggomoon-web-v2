'use client';

import * as React from 'react';
import { CopyIcon, FileTextIcon } from 'lucide-react';
import { toast } from 'sonner';

import JobPostingAnalysisModal from '@/features/job-posting/components/ui/JobPostingAnalysisModal';
import { MOCK_JOB_POSTING_ANALYSIS } from '@/features/job-posting/constants/mock';
import { Button } from '@/shared/components/ui/button';
import { StrategyResult, StrategyAnalysisCardData } from '@/features/strategy/types';

interface StrategyResultActionsProps {
  result: StrategyResult;
  isLoading: boolean;
}

export default function StrategyResultActions({ result, isLoading }: StrategyResultActionsProps) {
  const [analysisOpen, setAnalysisOpen] = React.useState(false);

  const handleCopyStrategy = async () => {
    try {
      await navigator.clipboard.writeText(formatStrategyResultForCopy(result));
      toast.success('전략 내용이 복사되었습니다.');
    } catch {
      toast.error('전략 내용을 복사하지 못했습니다.');
    }
  };

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2 md:flex md:items-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full md:w-auto"
          onClick={() => setAnalysisOpen(true)}
        >
          <FileTextIcon className="size-4" aria-hidden="true" />
          공고 분석 보기
        </Button>
        <Button
          type="button"
          size="sm"
          className="w-full md:w-auto"
          onClick={handleCopyStrategy}
          disabled={isLoading}
        >
          <CopyIcon className="size-4" aria-hidden="true" />
          전략 복사하기
        </Button>
      </div>

      <JobPostingAnalysisModal
        open={analysisOpen}
        onOpenChange={setAnalysisOpen}
        analysis={MOCK_JOB_POSTING_ANALYSIS}
      />
    </>
  );
}

function formatStrategyResultForCopy(result: StrategyResult) {
  return [
    result.jobTitle,
    result.createdAt,
    '',
    ...result.cards.map((card) => formatStrategyCardForCopy(card)),
  ].join('\n');
}

function formatStrategyCardForCopy(card: StrategyAnalysisCardData) {
  const heading = `[${card.order}] ${card.title}`;

  if (card.type === 'summary') {
    return `${heading}\n${card.content}\n`;
  }

  if (card.type === 'keywords') {
    return `${heading}\n${card.keywords.join(', ')}\n`;
  }

  return `${heading}\n${card.items.map((item) => `- ${item}`).join('\n')}\n`;
}
