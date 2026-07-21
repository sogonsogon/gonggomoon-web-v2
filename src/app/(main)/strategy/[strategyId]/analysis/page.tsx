import JobPostingAnalysisSection from '@/features/job-posting/components/sections/JobPostingAnalysisSection';
import StrategyStepIndicator from '@/features/strategy/components/ui/StrategyStepIndicator';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';

export default async function AnalysisPage({
  params,
  searchParams,
}: PageProps<'/strategy/[strategyId]/analysis'>) {
  const [{ strategyId }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const postAnalysisIdParam = resolvedSearchParams.postAnalysisId;
  const postAnalysisId = Array.isArray(postAnalysisIdParam)
    ? postAnalysisIdParam[0]
    : postAnalysisIdParam;

  if (!strategyId || !postAnalysisId) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-5 pt-3 md:px-10 md:pt-6">
        <p className="text-sm text-muted-foreground">
          공고 분석 결과를 확인할 수 없습니다. 다시 시도해주세요.
        </p>
        <Button variant="outline" size="sm">
          <Link href={`/`}>홈으로 돌아가기</Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-background">
      <StrategyStepIndicator currentStep="analysis" />
      <JobPostingAnalysisSection strategyId={strategyId} postAnalysisId={postAnalysisId} />
    </main>
  );
}
