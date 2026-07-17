'use client';

import * as React from 'react';
import { CopyIcon, FileTextIcon } from 'lucide-react';
import { toast } from 'sonner';

import JobPostingAnalysisModal from '@/features/job-posting/components/ui/JobPostingAnalysisModal';
import { Button } from '@/shared/components/ui/button';
import { StrategyResult } from '@/features/strategy/types';

interface StrategyResultActionsProps {
  strategy: StrategyResult;
}

export default function StrategyResultActions({ strategy }: StrategyResultActionsProps) {
  const [analysisOpen, setAnalysisOpen] = React.useState(false);

  const handleCopyStrategy = async () => {
    try {
      await navigator.clipboard.writeText(formatStrategyResultForCopy(strategy));
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
        <Button type="button" size="sm" className="w-full md:w-auto" onClick={handleCopyStrategy}>
          <CopyIcon className="size-4" aria-hidden="true" />
          전략 복사하기
        </Button>
      </div>

      <JobPostingAnalysisModal
        open={analysisOpen}
        onOpenChange={setAnalysisOpen}
        postAnalysisId={strategy.postAnalysisId}
      />
    </>
  );
}

function formatStrategyResultForCopy(strategy: StrategyResult) {
  return [
    strategy.postAnalysisTitle,
    strategy.createdAt.slice(0, 10).replace(/-/g, '.'),
    '',
    `[핵심 포지셔닝 메시지]\n${strategy.mainPositioningMessage}\n`,
    `[보완 가이드]\n${strategy.improvementGuides
      .map((item) => `- ${item.title}\n  ${item.description}`)
      .join('\n')}\n`,
    `[경험별 포인트]\n${strategy.experienceStrategyPoints
      .map((item) => `- ${item.experienceTitle}\n  ${item.strategyPoint}`)
      .join('\n')}\n`,
    `[경험 정렬 전략]\n${strategy.experienceOrdering
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((item, index) => `${index + 1}. ${item.title}\n   ${item.reason}`)
      .join('\n')}\n`,
    `[강조 키워드]\n${strategy.keywords.join(', ')}\n`,
    `[강조 역량]\n${strategy.strengths.map((item) => `- ${item}`).join('\n')}\n`,
    `[KPI(핵심 성과 지표)]\n${strategy.kpiCheckList.map((item) => `- ${item}`).join('\n')}\n`,
  ].join('\n');
}
