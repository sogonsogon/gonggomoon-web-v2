import ExperienceSelectionSection from '@/features/experience/components/sections/ExperienceSelectionSection';
import StrategyStepIndicator from '@/features/strategy/components/ui/StrategyStepIndicator';

export default async function ExperienceSelectPage({
  params,
}: PageProps<'/strategy/[strategyId]/experience-select'>) {
  const { strategyId } = await params;

  return (
    <main className="min-h-svh bg-background">
      <StrategyStepIndicator currentStep="experience" />
      <ExperienceSelectionSection strategyId={strategyId} />
    </main>
  );
}
