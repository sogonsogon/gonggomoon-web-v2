import { FileTextIcon, FileUpIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';

interface ExperienceExtractionBannerProps {
  onExtractionClick: () => void;
  onRegisterClick: () => void;
}

export default function ExperienceExtractionBanner({
  onExtractionClick,
  onRegisterClick,
}: ExperienceExtractionBannerProps) {
  return (
    <div className="flex min-h-[208px] w-full flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-primary/30 bg-primary/5 px-5 py-8 text-center">
      <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
        <FileTextIcon className="size-5" aria-hidden="true" />
      </div>
      <div className="grid gap-1">
        <h2 className="text-base leading-[1.45] font-bold text-foreground break-keep">
          이력서·포트폴리오에서 경험 추출하기
        </h2>
        <p className="text-sm leading-[1.55] text-muted-foreground break-keep break-words">
          기존에 작성한 문서를 업로드하면 경험을 자동으로 추출할 수 있습니다.
        </p>
      </div>
      <Button type="button" variant="outline" size="sm" onClick={onExtractionClick}>
        <FileUpIcon className="size-4" aria-hidden="true" />
        파일에서 추출하기
      </Button>
    </div>
  );
}
