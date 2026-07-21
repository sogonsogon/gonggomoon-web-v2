'use client';

import ExperienceEmptyState from '@/features/experience/components/ui/ExperienceEmptyState';
import ExperienceListItem from '@/features/experience/components/ui/ExperienceListItem';
import ExperienceListSkeleton from '@/features/experience/components/ui/ExperienceListSkeleton';
import ExperienceWriteButton from '@/features/experience/components/ui/ExperienceWriteButton';
import type { Experience } from '@/features/experience/types';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/lib/cn';

interface ExperienceListSectionProps {
  experiences: Experience[];
  isLoading: boolean;
  selectedExperienceIds: Set<string>;
  onSelectedChange: (experienceId: string, selected: boolean) => void;
  onToggleAll: () => void;
  onRegisterClick: () => void;
  onDetailClick: (experience: Experience) => void;
  onEditClick: (experience: Experience) => void;
}

export default function ExperienceListSection({
  experiences,
  isLoading,
  selectedExperienceIds,
  onSelectedChange,
  onToggleAll,
  onRegisterClick,
  onDetailClick,
  onEditClick,
}: ExperienceListSectionProps) {
  const isAllSelected = experiences.length > 0 && selectedExperienceIds.size === experiences.length;
  const hasExperiences = !isLoading && experiences.length > 0;

  return (
    <section className="grid gap-3">
      <div
        className={cn(
          'grid gap-2 sm:flex sm:items-center',
          hasExperiences ? 'sm:justify-between' : 'sm:justify-end',
        )}
      >
        {hasExperiences ? (
          <div className="flex items-baseline justify-between gap-2 sm:justify-start">
            <Button type="button" variant="ghost" size="xs" onClick={onToggleAll}>
              {isAllSelected ? '전체 해제' : '전체 선택'}
            </Button>
            <span className="text-[11px] leading-[1.45] text-muted-foreground">
              {selectedExperienceIds.size}개 선택
            </span>
          </div>
        ) : null}

        <ExperienceWriteButton onClick={onRegisterClick} />
      </div>

      {isLoading ? (
        <ExperienceListSkeleton variant="checkbox" />
      ) : hasExperiences ? (
        <ul className="grid gap-2">
          {experiences.map((experience) => (
            <ExperienceListItem
              key={experience.experienceId}
              experience={experience}
              selected={selectedExperienceIds.has(experience.experienceId)}
              onSelectedChange={onSelectedChange}
              onDetailClick={onDetailClick}
              onEditClick={onEditClick}
            />
          ))}
        </ul>
      ) : (
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
          <ExperienceEmptyState message="경험을 먼저 등록하고 선택할 수 있어요" />
        </div>
      )}
    </section>
  );
}
