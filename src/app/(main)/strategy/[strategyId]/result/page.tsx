import StrategyResultSection from '@/features/strategy/components/sections/StrategyResultSection';

export default async function StrategyResultPage({
  params,
}: PageProps<'/strategy/[strategyId]/result'>) {
  const { strategyId } = await params;
  const numericStrategyId = Number(strategyId);

  return (
    <main className="min-h-svh bg-background">
      <StrategyResultSection strategyId={numericStrategyId} />
    </main>
  );
}
