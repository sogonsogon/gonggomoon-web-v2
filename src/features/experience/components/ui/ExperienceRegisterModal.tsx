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

export interface ExperienceFormValue {
  type: string;
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
  title: string;
  description: string;
  submitLabel: string;
  initialValue?: Partial<ExperienceFormValue>;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_FORM_VALUE: ExperienceFormValue = {
  type: '',
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

  // TODO: 등록, 수정 query 로직 import 후 사용

  const handleSumbit = () => {
    // id가 존재하는 경우 -> 수정
    // id가 존재하지 않으면 -> 등록
  };

  return (
    <>
      <ModalHeader title={title} description={description} />

      <div className="grid gap-3">
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
            handleSumbit();
          }}
        >
          {submitLabel}
        </Button>
      </ModalFooter>
    </>
  );
}
