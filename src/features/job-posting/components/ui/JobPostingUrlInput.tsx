'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpIcon } from 'lucide-react';
import { toast } from 'sonner';

import AiProcessingOverlay from '@/shared/components/ui/AiProcessingOverlay';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { MOCK_JOB_POSTING_ANALYSIS } from '@/features/job-posting/constants/mock';
import { simulateAiRequest } from '@/shared/lib/SimulateAiRequest';

const JOB_POSTING_URL_REGEX = /^https?:\/\/(?:[\w-]+\.)+[\w-]{2,}(?::\d{2,5})?(?:[/?#][^\s]*)?$/i;

export default function JobPostingUrlInput() {
  const router = useRouter();
  const [url, setUrl] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isProcessing) {
      return;
    }

    if (!JOB_POSTING_URL_REGEX.test(url.trim())) {
      toast.warning('유효한 공고 URL을 입력해주세요.');
      return;
    }

    setIsProcessing(true);

    try {
      await simulateAiRequest();
      // TODO: 실제 API 연동 시 POST /api/v1/posts 응답의 analysisId로 교체
      const analysisId = MOCK_JOB_POSTING_ANALYSIS.id;
      router.push(`/strategy/${analysisId}/analysis`);
    } catch {
      setIsProcessing(false);
      toast.error('공고를 분석하지 못했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <form
        noValidate
        aria-busy={isProcessing}
        className="flex min-h-[140px] w-full flex-col justify-between gap-[var(--gap-lg)] rounded-[var(--radius-lg)] border border-border bg-card p-4 shadow-[20px_15px_100px_#3183f566] md:p-[22px]"
        onSubmit={handleSubmit}
      >
        <Input
          type="url"
          value={url}
          placeholder="채용 공고 URL을 입력하세요."
          className="h-auto border-0 bg-transparent px-0 py-0 text-base leading-[1.55] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 md:text-base"
          onChange={(event) => setUrl(event.target.value)}
        />

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
    </>
  );
}
