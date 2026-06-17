import { CheckIcon, ChevronRightIcon, PencilIcon, Trash2Icon } from 'lucide-react';

import type { Experience } from '@/features/experience/types';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/cn';

interface ExperienceListItemProps {
  experience: Experience;
  selected: boolean;
  onSelectedChange: (experienceId: string, selected: boolean) => void;
  onDetailClick: (experience: Experience) => void;
  onEditClick: (experience: Experience) => void;
}

export default function ExperienceListItem({
  experience,
  selected,
  onSelectedChange,
  onDetailClick,
  onEditClick,
}: ExperienceListItemProps) {
  const handleToggle = () => {
    onSelectedChange(experience.id, !selected);
  };

  return (
    <li
      className={cn(
        'flex min-w-0 items-center rounded-[var(--radius-sm)] border border-border bg-card transition-colors',
        selected && 'border-primary bg-primary/5',
      )}
    >
      <div
        role="checkbox"
        tabIndex={0}
        aria-checked={selected}
        aria-label={`${experience.title} 선택`}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-4 py-3 outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50"
        onClick={handleToggle}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleToggle();
          }
        }}
      >
        <span
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
            selected
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border bg-background text-transparent',
          )}
          aria-hidden="true"
        >
          <CheckIcon className="size-3.5" />
        </span>

        <div className="grid min-w-0 flex-1 gap-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {experience.type}
            </Badge>
            <span className="invisible text-xs leading-[1.45] text-muted-foreground md:visible">
              {experience.period}
            </span>
          </div>
          <span className="truncate text-sm leading-[1.5] font-bold text-foreground break-keep break-words">
            {experience.title}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 pr-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`${experience.title} 삭제`}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2Icon className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`${experience.title} 수정`}
          className="text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => onEditClick(experience)}
        >
          <PencilIcon className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`${experience.title} 상세 보기`}
          className="text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={() => onDetailClick(experience)}
        >
          <ChevronRightIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}
