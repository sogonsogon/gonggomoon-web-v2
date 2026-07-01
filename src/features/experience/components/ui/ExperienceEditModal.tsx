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

function toMonthPickerValue(date: string | null | undefined) {
  if (!date) {
    return null;
  }

  const [year, month] = date.includes('-') ? date.split('-') : date.split('.');

  if (!year || !month) {
    return null;
  }

  return `${year}.${month.padStart(2, '0')}`;
}

export default function ExperienceEditModal({
  open,
  onOpenChange,
  experience,
}: ExperienceEditModalProps) {
  const initialValue: Partial<ExperienceFormValue> | undefined = experience
    ? {
        experienceType: experience.experienceType,
        title: experience.title,
        startDate: toMonthPickerValue(experience.startDate),
        endDate: toMonthPickerValue(experience.endDate),
        ongoing: experience.endDate === null,
        experienceContent: experience.experienceContent,
      }
    : undefined;

  return (
    <Modal open={open && Boolean(experience)} onOpenChange={onOpenChange}>
      {experience ? (
        <ModalContent size="md">
          <ExperienceFormModalContent
            id={experience.experienceId}
            key={`${experience.experienceId}-${experience.startDate}`}
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
