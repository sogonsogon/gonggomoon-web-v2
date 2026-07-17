import ExperienceSelectionSection from '@/features/experience/components/sections/ExperienceSelectionSection';
import StrategyStepIndicator from '@/features/strategy/components/ui/StrategyStepIndicator';

export default async function ExperienceSelectPage({
  params,
  searchParams,
}: PageProps<'/strategy/[strategyId]/experience-select'>) {
  const [{ strategyId }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const postAnalysisIdParam = resolvedSearchParams.postAnalysisId;
  const postAnalysisId = Array.isArray(postAnalysisIdParam)
    ? postAnalysisIdParam[0]
    : postAnalysisIdParam;

  return (
    <main className="min-h-svh bg-background">
      <StrategyStepIndicator currentStep="experience" />
      <ExperienceSelectionSection strategyId={strategyId} postAnalysisId={postAnalysisId} />
    </main>
  );
}
