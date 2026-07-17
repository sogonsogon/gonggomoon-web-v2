'use client';

import JobPostingAnalysisCard from '@/features/job-posting/components/ui/JobPostingAnalysisCard';
import { useGetRecruitmentAnalysis } from '@/features/job-posting/queries';
import { Modal, ModalContent, ModalHeader } from '@/shared/components/ui/modal';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface JobPostingAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postAnalysisId: number;
}

export default function JobPostingAnalysisModal({
  open,
  onOpenChange,
  postAnalysisId,
}: JobPostingAnalysisModalProps) {
  const { data: analysis, isLoading, isError } = useGetRecruitmentAnalysis(postAnalysisId);

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="xl" className="gap-5 overflow-hidden">
        <ModalHeader title="공고 분석 보기" description="공고를 분석한 결과를 확인하세요" />

        <div className="min-h-0 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="grid gap-3">
              <div className="grid gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-full max-w-80" />
              </div>
              <Skeleton className="h-96 w-full rounded-[var(--radius-lg)]" />
            </div>
          ) : isError || !analysis ? (
            <div className="rounded-[var(--radius-lg)] border border-border bg-card p-6 text-sm text-muted-foreground">
              공고 분석 결과를 불러오지 못했습니다. 다시 시도해주세요.
            </div>
          ) : (
            <div className="grid gap-3">
              <div>
                <p className="text-xs leading-[1.45] font-medium text-primary">분석한 공고</p>
                <h2 className="mt-1 text-lg leading-[1.35] font-bold text-foreground break-keep break-words">
                  {analysis.title}
                </h2>
              </div>

              <JobPostingAnalysisCard analysis={analysis} />
            </div>
          )}
        </div>
      </ModalContent>
    </Modal>
  );
}
