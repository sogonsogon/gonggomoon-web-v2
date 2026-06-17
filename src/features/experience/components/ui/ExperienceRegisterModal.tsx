'use client';

import * as React from 'react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Modal, ModalContent, ModalFooter, ModalHeader } from '@/shared/components/ui/modal';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';

const EXPERIENCE_TYPE_OPTIONS = ['공모전', '교육', '프로젝트', '인턴십', '대외활동'] as const;

export interface ExperienceFormValue {
  type: string;
  startDate: string;
  endDate: string;
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
  startDate: '',
  endDate: '',
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
          <div className="grid grid-cols-2 gap-2">
            <Input
              value={formValue.startDate}
              placeholder="2023.01"
              className="bg-card"
              onChange={(event) => handleValueChange('startDate', event.target.value)}
            />
            <Input
              value={formValue.endDate}
              placeholder="2023.12"
              className="bg-card"
              onChange={(event) => handleValueChange('endDate', event.target.value)}
            />
          </div>
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
        <Button type="button" size="sm">
          {submitLabel}
        </Button>
      </ModalFooter>
    </>
  );
}
