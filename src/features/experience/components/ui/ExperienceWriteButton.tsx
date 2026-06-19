'use client';

import { PencilLineIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/cn';

interface ExperienceWriteButtonProps {
  className?: string;
  onClick: () => void;
}

export default function ExperienceWriteButton({
  className,
  onClick,
}: ExperienceWriteButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn('w-full sm:w-auto', className)}
      onClick={onClick}
    >
      <PencilLineIcon />
      직접 작성하기
    </Button>
  );
}
