import StrategyAnalysisCard from '@/features/strategy/components/ui/StrategyAnalysisCard';
import StrategyResultActions from '@/features/strategy/components/ui/StrategyResultActions';
import { MOCK_STRATEGY_RESULT } from '@/features/strategy/constants/mock';
import { Accordion } from '@/shared/components/ui/accordion';

interface StrategyResultSectionProps {
  strategyId: string;
}

export default function StrategyResultSection({ strategyId }: StrategyResultSectionProps) {
  const result = MOCK_STRATEGY_RESULT;
  const firstCardId = result.cards[0]?.id;

  return (
    <section
      data-strategy-id={strategyId}
      className="flex w-full justify-center bg-background px-5 py-10 md:px-10"
    >
      <div className="grid w-full max-w-[860px] gap-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-xs leading-[1.45] font-medium text-primary">{result.createdAt}</p>
            <h1 className="mt-1 text-2xl leading-[1.25] font-bold tracking-normal text-foreground break-keep md:text-[28px]">
              {result.jobTitle}
            </h1>
            <p className="mt-2 max-w-[620px] text-sm leading-[1.6] text-muted-foreground break-keep break-words">
              공고 분석 내용과 선택된 경험 기반으로 생성된 포트폴리오 전략을 확인해보세요.
            </p>
          </div>

          <StrategyResultActions result={result} />
        </header>

        <Accordion
          type="multiple"
          defaultValue={firstCardId ? [firstCardId] : undefined}
          className="grid gap-3"
        >
          {result.cards.map((card) => (
            <StrategyAnalysisCard key={card.id} card={card} />
          ))}
        </Accordion>
      </div>
    </section>
  );
}
