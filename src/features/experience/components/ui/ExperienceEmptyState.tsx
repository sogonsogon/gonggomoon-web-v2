import { BriefcaseBusinessIcon } from 'lucide-react';

interface ExperienceEmptyStateProps {
  message: string;
}

export default function ExperienceEmptyState({ message }: ExperienceEmptyStateProps) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-5 py-10 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <BriefcaseBusinessIcon className="size-[22px]" aria-hidden="true" />
      </div>
      <p className="text-sm leading-[1.55] font-medium text-muted-foreground break-keep">
        {message}
      </p>
    </div>
  );
}
