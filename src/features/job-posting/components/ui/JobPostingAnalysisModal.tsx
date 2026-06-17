'use client';

import JobPostingAnalysisCard from '@/features/job-posting/components/ui/JobPostingAnalysisCard';
import type { MOCK_JOB_POSTING_ANALYSIS } from '@/features/job-posting/constants/mock';
import { Modal, ModalContent, ModalHeader } from '@/shared/components/ui/modal';

interface JobPostingAnalysisModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysis: typeof MOCK_JOB_POSTING_ANALYSIS;
}

export default function JobPostingAnalysisModal({
  open,
  onOpenChange,
  analysis,
}: JobPostingAnalysisModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="xl" className="gap-5 overflow-hidden">
        <ModalHeader
          title="공고 분석 보기"
          description="공고 분석 결과를 확인하고 포트폴리오 전략의 기준을 점검하세요."
        />

        <div className="min-h-0 overflow-y-auto pr-1">
          <div className="grid gap-3">
          <div>
            <p className="text-xs leading-[1.45] font-medium text-primary">분석한 공고</p>
            <h2 className="mt-1 text-lg leading-[1.35] font-bold text-foreground break-keep break-words">
              {analysis.title}
            </h2>
          </div>

          <JobPostingAnalysisCard analysis={analysis} />
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
}
