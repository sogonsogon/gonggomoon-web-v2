import JobPostingAnalysisSection from '@/features/job-posting/components/sections/JobPostingAnalysisSection';
import StrategyStepIndicator from '@/features/strategy/components/ui/StrategyStepIndicator';

export default async function AnalysisPage({
  params,
}: PageProps<'/strategy/[strategyId]/analysis'>) {
  const { strategyId } = await params;

  return (
    <main className="min-h-svh bg-background">
      <StrategyStepIndicator currentStep="analysis" />
      <JobPostingAnalysisSection strategyId={strategyId} />
    </main>
  );
}
