import { FileTextIcon, FileUpIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/cn';

interface ExperienceExtractionBannerProps {
  size?: 'default' | 'compact';
  onExtractionClick: () => void;
}

export default function ExperienceExtractionBanner({
  size = 'default',
  onExtractionClick,
}: ExperienceExtractionBannerProps) {
  const isCompact = size === 'compact';

  return (
    <div
      className={cn(
        'flex w-full rounded-[var(--radius-lg)] border border-primary/30 bg-primary/5',
        isCompact
          ? 'min-h-[82px] flex-col gap-3 px-4 py-4 text-left sm:flex-row sm:items-center sm:justify-between sm:px-5'
          : 'min-h-[208px] flex-col items-center justify-center gap-3 px-5 py-8 text-center',
      )}
    >
      {!isCompact ? (
        <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FileTextIcon className="size-5" aria-hidden="true" />
        </div>
      ) : null}

      <div className={cn('grid min-w-0 gap-1', isCompact && 'flex-1')}>
        <h2 className="text-lg leading-[1.45] font-bold text-foreground break-keep">
          이력서·포트폴리오에서 경험 추출하기
        </h2>
        <p className="text-xs leading-[1.55] text-muted-foreground break-keep break-words">
          기존에 작성한 문서를 업로드하면 경험을 자동으로 추출할 수 있습니다.
        </p>
      </div>

      <Button
        type="button"
        variant={isCompact ? 'default' : 'outline'}
        size="sm"
        className={cn(isCompact && 'w-full sm:w-auto')}
        onClick={onExtractionClick}
      >
        <FileUpIcon className="size-4" aria-hidden="true" />
        파일에서 추출하기
      </Button>
    </div>
  );
}
