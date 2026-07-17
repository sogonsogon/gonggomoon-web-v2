'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

import ExperienceListSection from '@/features/experience/components/sections/ExperienceListSection';
import ExperienceDetailModal from '@/features/experience/components/ui/ExperienceDetailModal';
import ExperienceEditModal from '@/features/experience/components/ui/ExperienceEditModal';
import ExperienceExtractionBanner from '@/features/experience/components/ui/ExperienceExtractionBanner';
import ExperienceExtractionModal from '@/features/experience/components/ui/ExperienceExtractionModal';
import ExperienceRegisterModal from '@/features/experience/components/ui/ExperienceRegisterModal';
import type { Experience } from '@/features/experience/types';
import { useGetExperienceList } from '@/features/experience/queries';
import {
  getStrategyQueryOptions,
  strategyKeys,
  useCreateStrategy,
} from '@/features/strategy/queries';
import AiJobSseListener from '@/shared/components/AiJobSseListener';
import AiProcessingOverlay from '@/shared/components/ui/AiProcessingOverlay';
import { Button } from '@/shared/components/ui/button';
import type { AiJobSseFailurePayload } from '@/shared/types/ai';

interface ExperienceSelectionSectionProps {
  strategyId: string;
  postAnalysisId?: string;
}

type ExperienceModalType = 'extraction' | 'register' | 'detail' | 'edit' | null;

export default function ExperienceSelectionSection({
  strategyId,
  postAnalysisId,
}: ExperienceSelectionSectionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: createStrategy } = useCreateStrategy();
  const {
    data: experienceData = {
      totalCount: 0,
      contents: [],
    },
    isLoading,
  } = useGetExperienceList();
  const [activeModal, setActiveModal] = React.useState<ExperienceModalType>(null);
  const [activeExperience, setActiveExperience] = React.useState<Experience | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [pendingStrategyId, setPendingStrategyId] = React.useState<number | null>(null);
  const [selectedExperienceIds, setSelectedExperienceIds] = React.useState<Set<number>>(
    () => new Set(),
  );

  const handleSelectedChange = React.useCallback((experienceId: number, selected: boolean) => {
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

  const handleToggleAll = React.useCallback(() => {
    setSelectedExperienceIds((currentIds) => {
      if (
        experienceData.contents.length > 0 &&
        currentIds.size === experienceData.contents.length
      ) {
        return new Set();
      }

      return new Set(experienceData.contents.map((experience) => experience.experienceId));
    });
  }, [experienceData.contents]);

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

  const handleGenerateStrategy = () => {
    if (isProcessing || selectedExperienceIds.size === 0) {
      return;
    }

    const numericPostAnalysisId = Number(postAnalysisId);

    if (!Number.isSafeInteger(numericPostAnalysisId) || numericPostAnalysisId <= 0) {
      toast.error('공고 분석 정보를 확인하지 못했습니다. 다시 시도해주세요.');
      return;
    }

    setIsProcessing(true);

    createStrategy(
      {
        postAnalysisId: numericPostAnalysisId,
        experienceIds: [...selectedExperienceIds],
      },
      {
        onSuccess: (result) => {
          if (!result.strategyId) {
            setIsProcessing(false);
            toast.error('포트폴리오 전략을 생성하지 못했습니다. 다시 시도해주세요.');
            return;
          }

          setPendingStrategyId(result.strategyId);
        },
        onError: (error) => {
          setIsProcessing(false);
          toast.error(error.message || '포트폴리오 전략을 생성하지 못했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  const handleStrategyFinished = React.useCallback(async () => {
    if (!pendingStrategyId) {
      return;
    }

    try {
      await queryClient.fetchQuery({
        ...getStrategyQueryOptions(pendingStrategyId),
        staleTime: 0,
      });
      void queryClient.invalidateQueries({ queryKey: strategyKeys.list() });
      setPendingStrategyId(null);
      setIsProcessing(false);
      router.push(`/strategy/${pendingStrategyId}/result`);
    } catch (error) {
      setPendingStrategyId(null);
      setIsProcessing(false);
      toast.error(
        getErrorMessage(error) ||
          '포트폴리오 전략을 생성하지 못했습니다. 다시 시도해주세요.',
      );
    }
  }, [pendingStrategyId, queryClient, router]);

  const handleStrategyFailed = React.useCallback((payload: AiJobSseFailurePayload) => {
    setPendingStrategyId(null);
    setIsProcessing(false);
    toast.error(
      payload.message || '포트폴리오 전략을 생성하지 못했습니다. 다시 시도해주세요.',
    );
  }, []);

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
              disabled={isProcessing || selectedExperienceIds.size === 0}
              onClick={handleGenerateStrategy}
            >
              <ArrowRightIcon />
              포트폴리오 전략 생성
            </Button>
          </div>

          <ExperienceExtractionBanner onExtractionClick={() => setActiveModal('extraction')} />

          <ExperienceListSection
            experiences={experienceData.contents}
            isLoading={isLoading}
            selectedExperienceIds={selectedExperienceIds}
            onSelectedChange={handleSelectedChange}
            onToggleAll={handleToggleAll}
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

      {pendingStrategyId ? (
        <AiJobSseListener
          type="PORTFOLIO_STRATEGY"
          id={pendingStrategyId}
          onDone={handleStrategyFinished}
          onAlreadyFinished={handleStrategyFinished}
          onFailed={handleStrategyFailed}
        />
      ) : null}
    </>
  );
}

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const message = error.message;
    return typeof message === 'string' ? message : undefined;
  }

  return undefined;
}
