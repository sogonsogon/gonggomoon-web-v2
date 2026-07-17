'use client';

import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

import JobPostingAnalysisCard from '@/features/job-posting/components/ui/JobPostingAnalysisCard';
import { useGetRecruitmentAnalysis } from '@/features/job-posting/queries';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface JobPostingAnalysisSectionProps {
  strategyId: string;
  postAnalysisId?: string;
}

export default function JobPostingAnalysisSection({
  strategyId,
  postAnalysisId,
}: JobPostingAnalysisSectionProps) {
  const numericPostAnalysisId = parsePositiveInteger(postAnalysisId);
  const { data: analysis, isLoading, isError } = useGetRecruitmentAnalysis(numericPostAnalysisId);

  if (isLoading) {
    return (
      <section className="flex w-full justify-center bg-background px-5 pt-3 pb-10 md:px-10 md:pt-6">
        <div className="grid w-full max-w-[860px] gap-6">
          <div className="grid gap-2">
            <Skeleton className="h-8 w-full max-w-96" />
            <Skeleton className="h-4 w-full max-w-72" />
          </div>
          <Skeleton className="h-[420px] w-full rounded-[var(--radius-lg)]" />
        </div>
      </section>
    );
  }

  if (isError || !analysis) {
    return (
      <section className="flex w-full justify-center bg-background px-5 pt-3 pb-10 md:px-10 md:pt-6">
        <div className="w-full max-w-[860px] rounded-[var(--radius-lg)] border border-border bg-card p-6 text-sm text-muted-foreground">
          공고 분석 결과를 불러오지 못했습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="flex w-full justify-center bg-background px-5 pt-3 md:pt-6 pb-10 md:px-10">
      <div className="grid w-full max-w-[860px] gap-6">
        <div className="flex flex-col gap-[var(--gap-md)] md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl leading-[1.25] font-bold tracking-normal text-foreground md:text-[28px] break-keep">
              {analysis.title}
            </h1>
            <p className="mt-1 text-xs leading-[1.5] text-muted-foreground">
              AI가 분석한 채용 공고 요약 내용을 확인해보세요.
            </p>
          </div>

          <Button asChild size="sm" className="w-full md:w-auto">
            <Link
              href={`/strategy/${strategyId}/experience-select?postAnalysisId=${numericPostAnalysisId}`}
            >
              <ArrowRightIcon />
              경험 입력
            </Link>
          </Button>
        </div>

        <JobPostingAnalysisCard analysis={analysis} />
      </div>
    </section>
  );
}

function parsePositiveInteger(value?: string) {
  if (!value || !/^\d+$/.test(value)) {
    return Number.NaN;
  }

  const numericValue = Number(value);
  return Number.isSafeInteger(numericValue) && numericValue > 0 ? numericValue : Number.NaN;
}
