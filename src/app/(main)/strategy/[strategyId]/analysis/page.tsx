import JobPostingAnalysisSection from '@/features/job-posting/components/sections/JobPostingAnalysisSection';
import StrategyStepIndicator from '@/features/strategy/components/ui/StrategyStepIndicator';

export default async function AnalysisPage({
  params,
  searchParams,
}: PageProps<'/strategy/[strategyId]/analysis'>) {
  const [{ strategyId }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const postAnalysisIdParam = resolvedSearchParams.postAnalysisId;
  const postAnalysisId = Array.isArray(postAnalysisIdParam)
    ? postAnalysisIdParam[0]
    : postAnalysisIdParam;

  return (
    <main className="min-h-svh bg-background">
      <StrategyStepIndicator currentStep="analysis" />
      <JobPostingAnalysisSection strategyId={strategyId} postAnalysisId={postAnalysisId} />
    </main>
  );
}
