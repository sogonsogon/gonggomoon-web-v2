'use client';

import * as React from 'react';
import { ArrowUpIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

const JOB_POSTING_URL_REGEX = /^https?:\/\/(?:[\w-]+\.)+[\w-]{2,}(?::\d{2,5})?(?:[/?#][^\s]*)?$/i;

export default function JobPostingUrlInput() {
  const [url, setUrl] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!JOB_POSTING_URL_REGEX.test(url.trim())) {
      toast.warning('유효한 공고 URL을 입력해주세요.');
    }
  };

  return (
    <form
      noValidate
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
          disabled={url.trim() === ''}
        >
          <ArrowUpIcon className="size-[15px]" aria-hidden="true" />
        </Button>
      </div>
    </form>
  );
}
