import JobPostingUrlInput from '@/features/job-posting/components/ui/JobPostingUrlInput';

export default function JobPostingHomeSection() {
  return (
    <section className="flex min-h-svh w-full flex-col items-center justify-center gap-10 bg-background px-5 py-10 text-center md:px-16">
      <div className="grid w-full max-w-[620px] gap-[var(--gap-sm)]">
        <h1 className="text-2xl leading-[1.25] font-bold tracking-normal text-foreground md:text-[32px] text-pretty break-keep">
          공고 맞춤 포폴 전략을 세워보세요
        </h1>
        <p className="text-sm leading-[1.5] text-muted-foreground md:text-base whitespace-pre-line text-balance break-keep">
          {
            '채용 공고 URL만 입력하면 AI가 핵심 역량을 분석하고,\n 내 경험과 매칭해 맞춤 포트폴리오 전략을 만들어드립니다.'
          }
        </p>
      </div>

      <div className="w-full max-w-[680px] pb-20">
        <JobPostingUrlInput />
      </div>
    </section>
  );
}
