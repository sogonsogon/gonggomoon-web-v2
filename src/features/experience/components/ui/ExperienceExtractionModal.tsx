'use client';

import { FileTextIcon, FileUpIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/shared/components/ui/modal';

interface ExperienceExtractionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExperienceExtractionModal({
  open,
  onOpenChange,
}: ExperienceExtractionModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <ModalHeader
          title="경험 추출"
          description="이력서·포트폴리오 파일에서 경험을 자동으로 추출하세요."
        />

        <div className="grid gap-3">
          <div className="flex min-h-[156px] flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-dashed border-primary/40 bg-primary/5 px-5 py-8 text-center">
            <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FileUpIcon className="size-5" aria-hidden="true" />
            </div>
            <div className="grid gap-1">
              <p className="text-sm leading-[1.45] font-bold text-foreground">파일 선택</p>
              <p className="text-xs leading-[1.45] text-muted-foreground">
                10MB 이하 PDF 파일을 업로드하세요.
              </p>
            </div>
            <Button type="button" variant="outline" size="sm">
              파일 선택
            </Button>
          </div>

          <div className="flex items-center gap-3 rounded-[var(--radius-sm)] border border-border bg-card px-3 py-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-primary/10 text-primary">
              <FileTextIcon className="size-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm leading-[1.45] font-bold text-foreground">
                박세윤_포트폴리오.pdf
              </p>
              <p className="text-xs leading-[1.45] text-muted-foreground">1.3MB</p>
            </div>
          </div>
        </div>

        <ModalFooter>
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button type="button" size="sm">
            추출하기
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
