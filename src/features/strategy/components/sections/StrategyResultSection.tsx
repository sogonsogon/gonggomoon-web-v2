'use client';
import StrategyAnalysisCard from '@/features/strategy/components/ui/StrategyAnalysisCard';
import StrategyResultActions from '@/features/strategy/components/ui/StrategyResultActions';
import { useGetStrategy } from '@/features/strategy/queries';
import { Accordion } from '@/shared/components/ui/accordion';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface StrategyResultSectionProps {
  strategyId: string;
}

export default function StrategyResultSection({ strategyId }: StrategyResultSectionProps) {
  const { data, isLoading, isError } = useGetStrategy(strategyId);

  return (
    <section
      data-strategy-id={strategyId}
      className="flex w-full justify-center bg-background px-5 py-10 md:px-10"
    >
      <div className="grid w-full max-w-215 gap-5">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {isLoading ? (
            <div className="min-w-0 grid gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-full max-w-96" />
            </div>
          ) : isError || !data ? (
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">전략 정보를 불러오지 못했습니다.</p>
            </div>
          ) : (
            <div className="min-w-0">
              <p className="text-xs leading-[1.45] font-medium text-primary">{data.createdAt}</p>
              <h1 className="mt-1 text-2xl leading-tight font-bold tracking-normal text-foreground break-keep md:text-[28px]">
                {data.jobTitle}
              </h1>
              <p className="mt-2 max-w-155 text-sm leading-[1.6] text-muted-foreground break-keep wrap-break-word">
                공고 분석 내용과 선택된 경험 기반으로 생성된 포트폴리오 전략을 확인해보세요.
              </p>
            </div>
          )}
          {isLoading ? (
            <Skeleton className="h-10 w-full max-w-[200px] rounded-lg" />
          ) : isError || !data ? null : (
            <StrategyResultActions result={data} isLoading={isLoading} />
          )}
        </header>

        {isLoading ? (
          <div className="grid gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : isError || !data ? null : (
          <Accordion
            type="multiple"
            defaultValue={data.cards[0]?.id ? [data.cards[0].id] : undefined}
            className="grid gap-3"
          >
            {data.cards.map((card) => (
              <StrategyAnalysisCard key={card.id} card={card} />
            ))}
          </Accordion>
        )}
      </div>
    </section>
  );
}
