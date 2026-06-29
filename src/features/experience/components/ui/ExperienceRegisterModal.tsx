'use client';

import * as React from 'react';
import { Button } from '@/shared/components/ui/button';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/shared/components/ui/modal';
import MonthRangePicker from '@/shared/components/ui/MonthRangePicker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { EXPERIENCE_TYPE_OPTIONS } from '@/features/experience/constants/experienceOptions';
import { useCreateExperience, useUpdateExperience } from '@/features/experience/queries';
import { Input } from '@/shared/components/ui/input';
import { toast } from 'sonner';

export interface ExperienceFormValue {
  type: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  ongoing: boolean;
  content: string;
}

interface ExperienceRegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ExperienceFormModalContentProps {
  id?: string; // id가 존재하면 수정, 없으면 등록
  title: string;
  description: string;
  submitLabel: string;
  initialValue?: Partial<ExperienceFormValue>;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_FORM_VALUE: ExperienceFormValue = {
  type: '',
  title: '',
  startDate: null,
  endDate: null,
  ongoing: false,
  content: '',
};

export default function ExperienceRegisterModal({
  open,
  onOpenChange,
}: ExperienceRegisterModalProps) {
  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="md">
        <ExperienceFormModalContent
          title="경험 등록"
          description="경험을 직접 작성하고 등록하세요."
          submitLabel="저장"
          onOpenChange={onOpenChange}
        />
      </ModalContent>
    </Modal>
  );
}

export function ExperienceFormModalContent({
  id,
  title,
  description,
  submitLabel,
  initialValue,
  onOpenChange,
}: ExperienceFormModalContentProps) {
  const [formValue, setFormValue] = React.useState<ExperienceFormValue>({
    ...DEFAULT_FORM_VALUE,
    ...initialValue,
  });

  const { mutate: createExperience, isPending: isCreating } = useCreateExperience();
  const { mutate: updateExperience, isPending: isUpdating } = useUpdateExperience();
  const isSubmitting = isCreating || isUpdating;

  const handleValueChange = (field: keyof ExperienceFormValue, value: string) => {
    setFormValue((currentValue) => ({ ...currentValue, [field]: value }));
  };

  const handleRangeChange = React.useCallback(
    ({
      startMonth,
      endMonth,
      ongoing,
    }: {
      startMonth: string | null;
      endMonth: string | null;
      ongoing: boolean;
    }) => {
      setFormValue((currentValue) => ({
        ...currentValue,
        startDate: startMonth,
        endDate: endMonth,
        ongoing,
      }));
    },
    [],
  );

  const handleSubmit = () => {
    const data = {
      type: formValue.type,
      title: formValue.title,
      content: formValue.content,
      period: `${formValue.startDate} ~ ${formValue.endDate ?? '진행 중'}`,
    };
    if (id) {
      updateExperience(
        { id, data },
        {
          onSuccess: () => {
            onOpenChange(false);
            toast.success('경험이 수정되었습니다.');
          },
          onError: (error) => {
            toast.error(error.message || '경험 수정에 실패했습니다. 잠시 후 시도해주세요.');
          },
        },
      );
    } else {
      createExperience(data, {
        onSuccess: () => {
          onOpenChange(false);
          toast.success('경험이 등록되었습니다.');
        },
        onError: (error) => {
          toast.error(error.message || '경험 등록에 실패했습니다. 잠시 후 시도해주세요.');
        },
      });
    }
  };

  return (
    <>
      <ModalHeader title={title} description={description} />

      <div className="grid gap-3">
        <label className="grid gap-2">
          <span className="text-[13px] leading-[1.42] font-bold text-foreground">제목</span>
          <Input
            value={formValue.title}
            placeholder="경험 제목을 입력하세요."
            onChange={(event) => handleValueChange('title', event.target.value)}
          />
        </label>
        <label className="grid gap-2">
          <span className="text-[13px] leading-[1.42] font-bold text-foreground">경험 유형</span>
          <Select
            value={formValue.type}
            onValueChange={(value) => handleValueChange('type', value)}
          >
            <SelectTrigger className="w-full bg-card">
              <SelectValue placeholder="경험 유형 선택" />
            </SelectTrigger>
            <SelectContent>
              {EXPERIENCE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </label>

        <div className="grid gap-2">
          <span className="text-[13px] leading-[1.42] font-bold text-foreground">기간</span>
          <MonthRangePicker
            startMonth={formValue.startDate}
            endMonth={formValue.endDate}
            ongoing={formValue.ongoing}
            allowOngoing
            onRangeChange={handleRangeChange}
          />
        </div>

        <label className="grid gap-2">
          <span className="text-[13px] leading-[1.42] font-bold text-foreground">내용</span>
          <Textarea
            value={formValue.content}
            placeholder="경험 내용, 역할, 성과를 자유롭게 작성하세요."
            className="min-h-[112px] resize-none bg-card"
            onChange={(event) => handleValueChange('content', event.target.value)}
          />
        </label>
      </div>

      <ModalFooter>
        <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
          취소
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={() => {
            handleSubmit();
          }}
          disabled={isSubmitting}
        >
          {submitLabel}
        </Button>
      </ModalFooter>
    </>
  );
}
