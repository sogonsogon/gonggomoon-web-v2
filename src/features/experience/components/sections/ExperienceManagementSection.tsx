'use client';

import * as React from 'react';

import ExperienceEmptyState from '@/features/experience/components/ui/ExperienceEmptyState';
import ExperienceListItem from '@/features/experience/components/ui/ExperienceListItem';
import ExperienceDetailModal from '@/features/experience/components/ui/ExperienceDetailModal';
import ExperienceEditModal from '@/features/experience/components/ui/ExperienceEditModal';
import ExperienceExtractionBanner from '@/features/experience/components/ui/ExperienceExtractionBanner';
import ExperienceExtractionModal from '@/features/experience/components/ui/ExperienceExtractionModal';
import ExperienceListSkeleton from '@/features/experience/components/ui/ExperienceListSkeleton';
import ExperienceRegisterModal from '@/features/experience/components/ui/ExperienceRegisterModal';
import ExperienceWriteButton from '@/features/experience/components/ui/ExperienceWriteButton';
import {
  MOCK_EXPERIENCES,
  SHOW_EMPTY_EXPERIENCES,
  SHOW_LOADING_EXPERIENCES,
} from '@/features/experience/constants/mock';
import type { Experience } from '@/features/experience/types';
import { Skeleton } from '@/shared/components/ui/skeleton';

type ExperienceModalType = 'extraction' | 'register' | 'detail' | 'edit' | null;

// TODO: 경험 목록 조회 연동
// mock 데이터를 그냥 가져와서 쓰는 것을, queries 내의 로직 호출해서 가져오도록 수정.
const experiences = SHOW_EMPTY_EXPERIENCES ? [] : MOCK_EXPERIENCES;

export default function ExperienceManagementSection() {
  const [activeModal, setActiveModal] = React.useState<ExperienceModalType>(null);
  const [activeExperience, setActiveExperience] = React.useState<Experience | null>(null);

  const handleModalOpenChange = React.useCallback((open: boolean) => {
    if (!open) {
      setActiveModal(null);
      setActiveExperience(null);
    }
  }, []);

  const handleDetailClick = React.useCallback((experience: Experience) => {
    setActiveExperience(experience);
    setActiveModal('detail');
  }, []);

  const handleEditClick = React.useCallback((experience: Experience) => {
    setActiveExperience(experience);
    setActiveModal('edit');
  }, []);

  return (
    <>
      <section className="flex w-full justify-center bg-background px-5 pt-3 pb-10 md:px-10 md:pt-6">
        <div className="grid w-full max-w-[860px] gap-6">
          <div className="min-w-0">
            <h1 className="text-2xl leading-[1.25] font-bold tracking-normal text-foreground break-keep md:text-[28px]">
              경험 관리
            </h1>
            <p className="mt-1 text-xs leading-[1.5] text-muted-foreground break-keep break-words">
              등록한 경험을 확인하고, 관리할 수 있어요.
            </p>
          </div>

          <ExperienceExtractionBanner
            size="compact"
            onExtractionClick={() => setActiveModal('extraction')}
          />

          <section className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card">
            <div className="flex min-h-[74px] flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h2 className="text-base leading-[1.45] font-bold text-foreground break-keep">
                  경험 목록
                </h2>
                {SHOW_LOADING_EXPERIENCES ? (
                  <Skeleton aria-hidden="true" className="mt-1 h-3 w-24" />
                ) : (
                  <p className="mt-1 text-xs leading-[1.45] text-muted-foreground">
                    총 {experiences.length}개의 경험
                  </p>
                )}
              </div>
              <ExperienceWriteButton onClick={() => setActiveModal('register')} />
            </div>

            {SHOW_LOADING_EXPERIENCES ? (
              <ExperienceListSkeleton variant="view" />
            ) : experiences.length > 0 ? (
              <ul className="divide-y divide-border/70 border-t border-border/70">
                {experiences.map((experience) => (
                  <ExperienceListItem
                    key={experience.id}
                    variant="view"
                    experience={experience}
                    onDetailClick={handleDetailClick}
                    onEditClick={handleEditClick}
                  />
                ))}
              </ul>
            ) : (
              <div className="border-t border-border/70">
                <ExperienceEmptyState message="아직 등록된 경험이 없어요" />
              </div>
            )}
          </section>
        </div>
      </section>

      <ExperienceExtractionModal
        open={activeModal === 'extraction'}
        onOpenChange={handleModalOpenChange}
      />
      <ExperienceRegisterModal
        open={activeModal === 'register'}
        onOpenChange={handleModalOpenChange}
      />
      <ExperienceDetailModal
        open={activeModal === 'detail'}
        onOpenChange={handleModalOpenChange}
        experience={activeExperience}
      />
      <ExperienceEditModal
        open={activeModal === 'edit'}
        onOpenChange={handleModalOpenChange}
        experience={activeExperience}
      />
    </>
  );
}
