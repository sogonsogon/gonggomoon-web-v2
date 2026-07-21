'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpIcon } from 'lucide-react';
import { toast } from 'sonner';

import {
  useCreateRecruitmentAnalysis,
  useFetchRecruitmentAnalysisByStrategyId,
} from '@/features/job-posting/queries';
import AiJobSseListener from '@/shared/components/AiJobSseListener';
import AiProcessingOverlay from '@/shared/components/ui/AiProcessingOverlay';
import { Button } from '@/shared/components/ui/button';
import { Textarea } from '@/shared/components/ui/textarea';
import type { AiJobSseFailurePayload, AiJobStatusPayload } from '@/shared/types/ai';

const JOB_POSTING_URL_REGEX = /^https?:\/\/(?:[\w-]+\.)+[\w-]{2,}(?::\d{2,5})?(?:[/?#][^\s]*)?$/i;

export default function JobPostingUrlInput() {
  const router = useRouter();
  const { mutate: createRecruitmentAnalysis } = useCreateRecruitmentAnalysis();
  const fetchRecruitmentAnalysisByStrategyId = useFetchRecruitmentAnalysisByStrategyId();
  const [url, setUrl] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [pendingPostId, setPendingPostId] = React.useState<string | null>(null);

  const fetchAnalysisAndNavigate = React.useCallback(
    async (strategyId: string) => {
      try {
        const postAnalysisId = await fetchRecruitmentAnalysisByStrategyId(strategyId);
        setPendingPostId(null);
        setIsProcessing(false);
        const searchParams = new URLSearchParams({
          postAnalysisId: String(postAnalysisId),
        });
        router.push(`/strategy/${strategyId}/analysis?${searchParams.toString()}`);
      } catch (error) {
        setPendingPostId(null);
        setIsProcessing(false);
        toast.error(getErrorMessage(error) || '공고를 분석하지 못했습니다. 다시 시도해주세요.');
      }
    },
    [fetchRecruitmentAnalysisByStrategyId, router],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isProcessing) {
      return;
    }

    if (!JOB_POSTING_URL_REGEX.test(url.trim())) {
      toast.warning('유효한 공고 URL을 입력해주세요.');
      return;
    }

    setIsProcessing(true);

    createRecruitmentAnalysis(
      { postUrl: url.trim() },
      {
        onSuccess: (result) => {
          if (!result.postId) {
            setIsProcessing(false);
            toast.error('공고를 분석하지 못했습니다. 다시 시도해주세요.');
            return;
          }

          if (result.status === 'PENDING' || result.status === 'SUCCESS') {
            setPendingPostId(result.postId);
            return;
          }

          setIsProcessing(false);
          toast.error('공고를 분석하지 못했습니다. 다시 시도해주세요.');
        },
        onError: (error) => {
          setIsProcessing(false);
          toast.error(error.message || '공고를 분석하지 못했습니다. 다시 시도해주세요.');
        },
      },
    );
  };

  const handleAnalysisFinished = React.useCallback(
    (payload: AiJobStatusPayload) => {
      if (!pendingPostId) {
        return;
      }

      if (!payload.strategyId) {
        setPendingPostId(null);
        setIsProcessing(false);
        toast.error('공고 분석 완료 정보를 확인하지 못했습니다. 다시 시도해주세요.');
        return;
      }

      void fetchAnalysisAndNavigate(payload.strategyId);
    },
    [fetchAnalysisAndNavigate, pendingPostId],
  );

  const handleAnalysisAlreadyFinished = React.useCallback(() => {
    setPendingPostId(null);
    setIsProcessing(false);
    toast.error('공고 분석 완료 정보를 확인하지 못했습니다. 다시 시도해주세요.');
  }, []);

  const handleAnalysisFailed = React.useCallback((payload: AiJobSseFailurePayload) => {
    setPendingPostId(null);
    setIsProcessing(false);
    toast.error(payload.message || '공고를 분석하지 못했습니다. 다시 시도해주세요.');
  }, []);

  return (
    <>
      <form
        noValidate
        aria-busy={isProcessing}
        className="flex min-h-[140px] w-full flex-col justify-between gap-1 overflow-clip rounded-[var(--radius-lg)] border border-border bg-card p-3 shadow-[20px_15px_100px_#3183f566] md:p-4"
        onSubmit={handleSubmit}
      >
        <div className="-mt-3 max-h-24 overflow-x-hidden overflow-y-auto [mask-image:linear-gradient(to_bottom,rgba(0,0,0,0.2)_0,black_12px,black_calc(100%_-_12px),rgba(0,0,0,0.2)_100%)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:-mt-4">
          <Textarea
            value={url}
            rows={1}
            wrap="soft"
            placeholder="채용 공고 URL을 입력하세요"
            className="min-h-0 w-full resize-none overflow-hidden border-0 bg-transparent px-0 pt-3 pb-3 text-base leading-[1.55] break-all shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 md:pt-4 md:pb-4 md:text-base"
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            size="icon-sm"
            aria-label="분석 시작"
            className="size-[35px] rounded-full"
            disabled={url.trim() === '' || isProcessing}
          >
            <ArrowUpIcon className="size-[15px]" aria-hidden="true" />
          </Button>
        </div>
      </form>

      <AiProcessingOverlay
        open={isProcessing}
        title="채용 공고를 분석하고 있어요"
        description="핵심 역량과 요구사항을 정리하고 있어요. 잠시만 기다려주세요."
      />

      {pendingPostId ? (
        <AiJobSseListener
          type="POST_ANALYSIS"
          id={pendingPostId}
          onDone={handleAnalysisFinished}
          onAlreadyFinished={handleAnalysisAlreadyFinished}
          onFailed={handleAnalysisFailed}
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
