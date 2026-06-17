'use client';

import type { Experience } from '@/features/experience/types';
import { Badge } from '@/shared/components/ui/badge';
import { Modal, ModalContent, ModalHeader } from '@/shared/components/ui/modal';

interface ExperienceDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: Experience | null;
}

export default function ExperienceDetailModal({
  open,
  onOpenChange,
  experience,
}: ExperienceDetailModalProps) {
  return (
    <Modal open={open && Boolean(experience)} onOpenChange={onOpenChange}>
      {experience ? (
        <ModalContent size="md">
          <ModalHeader title="경험 상세" description="등록한 경험의 상세 내용을 확인하세요." />

          <section className="grid gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {experience.type}
              </Badge>
              <span className="text-xs leading-[1.45] text-muted-foreground">
                {experience.period}
              </span>
            </div>

            <div className="grid gap-3 rounded-[var(--radius-lg)] border border-border bg-muted/60 p-4">
              <h3 className="text-base leading-[1.45] font-bold text-foreground break-keep break-words">
                {experience.title}
              </h3>
              <p className="text-sm leading-[1.65] text-muted-foreground break-keep break-words">
                {experience.content}
              </p>
            </div>
          </section>
        </ModalContent>
      ) : null}
    </Modal>
  );
}
