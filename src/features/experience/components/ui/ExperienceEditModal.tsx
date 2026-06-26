'use client';

import {
  ExperienceFormModalContent,
  type ExperienceFormValue,
} from '@/features/experience/components/ui/ExperienceRegisterModal';
import type { Experience } from '@/features/experience/types';
import { Modal, ModalContent } from '@/shared/components/ui/modal';

interface ExperienceEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: Experience | null;
}

export default function ExperienceEditModal({
  open,
  onOpenChange,
  experience,
}: ExperienceEditModalProps) {
  const periodValue = experience ? parseExperiencePeriod(experience.period) : null;
  const initialValue: Partial<ExperienceFormValue> | undefined =
    experience && periodValue
      ? {
          type: experience.type,
          title: experience.title,
          startDate: periodValue.startDate,
          endDate: periodValue.endDate,
          ongoing: periodValue.ongoing,
          content: experience.content,
        }
      : undefined;

  return (
    <Modal open={open && Boolean(experience)} onOpenChange={onOpenChange}>
      {experience ? (
        <ModalContent size="md">
          <ExperienceFormModalContent
            id={experience.id}
            key={`${experience.id}-${experience.period}`}
            title="경험 수정"
            description="등록한 경험 내용을 수정하세요."
            submitLabel="저장"
            initialValue={initialValue}
            onOpenChange={onOpenChange}
          />
        </ModalContent>
      ) : null}
    </Modal>
  );
}

export function parseExperiencePeriod(period: string) {
  const [startDate = '', endDate = ''] = period.split('-').map((value) => value.trim());
  const ongoing = endDate === '진행 중';

  return {
    startDate: startDate || null,
    endDate: ongoing ? null : endDate || null,
    ongoing,
  };
}
