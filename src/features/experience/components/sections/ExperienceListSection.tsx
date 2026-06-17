'use client';

import * as React from 'react';
import { PencilLineIcon } from 'lucide-react';

import ExperienceListItem from '@/features/experience/components/ui/ExperienceListItem';
import type { Experience } from '@/features/experience/types';
import { Button } from '@/shared/components/ui/button';

interface ExperienceListSectionProps {
  experiences: Experience[];
  onRegisterClick: () => void;
  onDetailClick: (experience: Experience) => void;
  onEditClick: (experience: Experience) => void;
}

export default function ExperienceListSection({
  experiences,
  onRegisterClick,
  onDetailClick,
  onEditClick,
}: ExperienceListSectionProps) {
  const [selectedExperienceIds, setSelectedExperienceIds] = React.useState<Set<string>>(
    () => new Set(),
  );

  const handleSelectedChange = React.useCallback((experienceId: string, selected: boolean) => {
    setSelectedExperienceIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (selected) {
        nextIds.add(experienceId);
      } else {
        nextIds.delete(experienceId);
      }

      return nextIds;
    });
  }, []);

  const isAllSelected = experiences.length > 0 && selectedExperienceIds.size === experiences.length;

  const handleToggleAll = React.useCallback(() => {
    setSelectedExperienceIds(() => {
      if (isAllSelected) {
        return new Set();
      }

      return new Set(experiences.map((experience) => experience.id));
    });
  }, [experiences, isAllSelected]);

  return (
    <section className="grid gap-3">
      <div className="grid gap-2 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-baseline justify-between gap-2 sm:justify-start">
          <Button type="button" variant="ghost" size="xs" onClick={handleToggleAll}>
            {isAllSelected ? '전체 해제' : '전체 선택'}
          </Button>
          <span className="text-[11px] leading-[1.45] text-muted-foreground">
            {selectedExperienceIds.size}개 선택
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full sm:w-auto"
          onClick={onRegisterClick}
        >
          <PencilLineIcon />
          직접 입력
        </Button>
      </div>

      <ul className="grid gap-2">
        {experiences.map((experience) => (
          <ExperienceListItem
            key={experience.id}
            experience={experience}
            selected={selectedExperienceIds.has(experience.id)}
            onSelectedChange={handleSelectedChange}
            onDetailClick={onDetailClick}
            onEditClick={onEditClick}
          />
        ))}
      </ul>
    </section>
  );
}
