'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from 'lucide-react';
import { toast } from 'sonner';

import ExperienceListSection from '@/features/experience/components/sections/ExperienceListSection';
import ExperienceDetailModal from '@/features/experience/components/ui/ExperienceDetailModal';
import ExperienceEditModal from '@/features/experience/components/ui/ExperienceEditModal';
import ExperienceExtractionBanner from '@/features/experience/components/ui/ExperienceExtractionBanner';
import ExperienceExtractionModal from '@/features/experience/components/ui/ExperienceExtractionModal';
import ExperienceRegisterModal from '@/features/experience/components/ui/ExperienceRegisterModal';
import {
  MOCK_EXPERIENCES,
  SHOW_EMPTY_EXPERIENCES,
  SHOW_LOADING_EXPERIENCES,
} from '@/features/experience/constants/mock';
import type { Experience } from '@/features/experience/types';
import AiProcessingOverlay from '@/shared/components/ui/AiProcessingOverlay';
import { Button } from '@/shared/components/ui/button';
import { simulateAiRequest } from '@/shared/lib/SimulateAiRequest';

interface ExperienceSelectionSectionProps {
  strategyId: string;
}

type ExperienceModalType = 'extraction' | 'register' | 'detail' | 'edit' | null;

const experiences = SHOW_EMPTY_EXPERIENCES ? [] : MOCK_EXPERIENCES;

export default function ExperienceSelectionSection({
  strategyId,
}: ExperienceSelectionSectionProps) {
  const router = useRouter();
  const [activeModal, setActiveModal] = React.useState<ExperienceModalType>(null);
  const [activeExperience, setActiveExperience] = React.useState<Experience | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

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

  const handleGenerateStrategy = async () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      await simulateAiRequest();
      router.push(`/strategy/${strategyId}/result`);
    } catch {
      setIsProcessing(false);
      toast.error('포트폴리오 전략을 생성하지 못했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <section
        data-strategy-id={strategyId}
        className="flex w-full justify-center bg-background px-5 pt-3 pb-10 md:px-10 md:pt-6"
      >
        <div className="grid w-full max-w-[860px] gap-6">
          <div className="flex flex-col gap-[var(--gap-md)] md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl leading-[1.25] font-bold tracking-normal text-foreground break-keep md:text-[28px]">
                경험 입력
              </h1>
              <p className="mt-1 text-xs leading-[1.5] text-muted-foreground break-keep break-words">
                포트폴리오 전략에 사용할 경험을 선택하세요.
              </p>
            </div>

            <Button
              type="button"
              size="sm"
              className="w-full md:w-auto"
              disabled={isProcessing}
              onClick={handleGenerateStrategy}
            >
              <ArrowRightIcon />
              포트폴리오 전략 생성
            </Button>
          </div>

          <ExperienceExtractionBanner onExtractionClick={() => setActiveModal('extraction')} />

          <ExperienceListSection
            experiences={experiences}
            isLoading={SHOW_LOADING_EXPERIENCES}
            onRegisterClick={() => setActiveModal('register')}
            onDetailClick={handleDetailClick}
            onEditClick={handleEditClick}
          />
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
      <AiProcessingOverlay
        open={isProcessing}
        title="포트폴리오 전략을 생성하고 있어요"
        description="공고와 선택한 경험을 바탕으로 맞춤 전략을 만들고 있어요. 잠시만 기다려주세요."
      />
    </>
  );
}
