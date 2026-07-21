import type { KeyboardEvent, MouseEvent } from 'react';
import { CheckIcon, ChevronRightIcon, PencilIcon, Trash2Icon } from 'lucide-react';

import type { Experience } from '@/features/experience/types';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/cn';
import { toast } from 'sonner';
import { useDeleteExperience } from '@/features/experience/queries';
import { EXPERIENCE_TYPE_OPTIONS } from '@/features/experience/constants/experienceOptions';

interface BaseExperienceListItemProps {
  experience: Experience;
  onDetailClick: (experience: Experience) => void;
  onEditClick: (experience: Experience) => void;
}

type ExperienceListItemProps =
  | (BaseExperienceListItemProps & {
      variant?: 'checkbox';
      selected: boolean;
      onSelectedChange: (experienceId: string, selected: boolean) => void;
    })
  | (BaseExperienceListItemProps & {
      variant: 'view';
      selected?: never;
      onSelectedChange?: never;
    });

export default function ExperienceListItem(props: ExperienceListItemProps) {
  const { experience, onDetailClick, onEditClick } = props;
  const isCheckboxVariant = props.variant !== 'view';
  const selected = isCheckboxVariant ? props.selected : false;
  const { mutate: deleteExperience } = useDeleteExperience();

  const handleToggle = () => {
    if (props.variant !== 'view') {
      props.onSelectedChange(experience.experienceId, !selected);
      return;
    }

    onDetailClick(experience);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  const handleActionClick = (action: () => void) => (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    action();
  };

  const handleDelete = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      deleteExperience(experience.experienceId, {
        onSuccess: () => {
          toast.success(`경험이 삭제되었습니다.`);
        },
        onError: () => {
          toast.error('경험 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
        },
      });
    }
  };
  const typeLabel =
    EXPERIENCE_TYPE_OPTIONS.find((option) => option.value === experience.experienceType)?.label ??
    experience.experienceType;

  return (
    <li
      className={cn(
        'flex min-w-0 items-center transition-colors',
        isCheckboxVariant
          ? cn(
              'rounded-[var(--radius-sm)] border',
              selected
                ? 'border-primary bg-primary/5 hover:border-primary hover:bg-primary/10'
                : 'border-border bg-card hover:border-border/80 hover:bg-muted/30',
            )
          : 'min-h-[86px] bg-transparent hover:bg-muted/40',
      )}
    >
      <div
        role={isCheckboxVariant ? 'checkbox' : 'button'}
        tabIndex={0}
        aria-checked={isCheckboxVariant ? selected : undefined}
        aria-label={`${experience.title} ${isCheckboxVariant ? '선택' : '상세 보기'}`}
        className={cn(
          'flex min-w-0 flex-1 cursor-pointer items-center gap-3 outline-none transition-colors focus-visible:ring-[3px] focus-visible:ring-ring/50',
          isCheckboxVariant ? 'px-4 py-3' : 'px-4 py-5',
        )}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        {isCheckboxVariant ? (
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
        ) : null}

        <div className="grid min-w-0 flex-1 gap-1">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {typeLabel}
            </Badge>
            <span className="text-xs leading-[1.45] text-muted-foreground">
              {`${experience.startDate} ~ ${experience.endDate ?? '진행 중'}`}
            </span>
          </div>
          <span
            className={cn(
              'text-sm leading-[1.5] font-bold text-foreground break-keep break-words',
              isCheckboxVariant ? 'truncate' : 'min-w-0',
            )}
          >
            {experience.title}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3 pr-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`${experience.title} 삭제`}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={handleActionClick(() => handleDelete())}
        >
          <Trash2Icon className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`${experience.title} 수정`}
          className="text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={handleActionClick(() => onEditClick(experience))}
        >
          <PencilIcon className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`${experience.title} 상세 보기`}
          className="text-muted-foreground hover:bg-muted hover:text-foreground"
          onClick={handleActionClick(() => onDetailClick(experience))}
        >
          <ChevronRightIcon className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </li>
  );
}
