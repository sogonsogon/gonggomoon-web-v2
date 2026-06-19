import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

import JobPostingAnalysisCard from '@/features/job-posting/components/ui/JobPostingAnalysisCard';
import { MOCK_JOB_POSTING_ANALYSIS } from '@/features/job-posting/constants/mock';
import { Button } from '@/shared/components/ui/button';

interface JobPostingAnalysisSectionProps {
  strategyId: string;
}

export default function JobPostingAnalysisSection({ strategyId }: JobPostingAnalysisSectionProps) {
  const analysis = MOCK_JOB_POSTING_ANALYSIS;

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
            <Link href={`/strategy/${strategyId}/experience-select`}>
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
