'use client';
import StrategyAnalysisCard from '@/features/strategy/components/ui/StrategyAnalysisCard';
import StrategyResultActions from '@/features/strategy/components/ui/StrategyResultActions';
import TextListCard from '@/features/strategy/components/ui/TextListCard';
import { useGetStrategy } from '@/features/strategy/queries';
import { Accordion } from '@/shared/components/ui/accordion';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface StrategyResultSectionProps {
  strategyId: number;
}

export default function StrategyResultSection({ strategyId }: StrategyResultSectionProps) {
  const { data: strategyData, isLoading, isError } = useGetStrategy(strategyId);

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
          ) : isError || !strategyData ? (
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">전략 정보를 불러오지 못했습니다.</p>
            </div>
          ) : (
            <div className="min-w-0">
              <p className="text-xs leading-[1.45] font-medium text-primary">
                {strategyData.createdAt}
              </p>
              <h1 className="mt-1 text-2xl leading-tight font-bold tracking-normal text-foreground break-keep md:text-[28px]">
                {strategyData.industryName}
              </h1>
              <p className="mt-2 max-w-155 text-sm leading-[1.6] text-muted-foreground break-keep wrap-break-word">
                공고 분석 내용과 선택된 경험 기반으로 생성된 포트폴리오 전략을 확인해보세요.
              </p>
            </div>
          )}
          {isLoading ? (
            <Skeleton className="h-10 w-full max-w-[200px] rounded-lg" />
          ) : isError || !strategyData ? null : (
            <StrategyResultActions result={strategyData} />
          )}
        </header>

        {isLoading ? (
          <div className="grid gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : isError || !strategyData ? null : (
          <Accordion type="multiple" defaultValue={['positioning']} className="grid gap-3">
            <StrategyAnalysisCard id="positioning" order={1} title="핵심 포지셔닝 메시지" highlight>
              <p className="text-sm leading-[1.7] text-foreground break-keep break-words">
                {strategyData.mainPositioningMessage}
              </p>
            </StrategyAnalysisCard>

            <StrategyAnalysisCard id="experienceOrdering" order={2} title="경험 배치 순서">
              <TextListCard
                items={strategyData.experienceOrdering
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((item) => `${item.title} — ${item.reason}`)}
              />
            </StrategyAnalysisCard>

            <StrategyAnalysisCard id="experienceStrategyPoints" order={3} title="경험별 전략 포인트">
              <TextListCard
                items={strategyData.experienceStrategyPoints.map(
                  (item) => `${item.experienceTitle}: ${item.strategyPoint}`,
                )}
              />
            </StrategyAnalysisCard>

            <StrategyAnalysisCard id="keywords" order={4} title="강조 키워드">
              <div className="flex flex-wrap gap-2">
                {strategyData.keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="outline"
                    className="border-primary/30 bg-primary/10 text-primary"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </StrategyAnalysisCard>

            <StrategyAnalysisCard id="strengths" order={5} title="강조 역량">
              <TextListCard items={strategyData.strengths} />
            </StrategyAnalysisCard>

            <StrategyAnalysisCard id="kpiCheckList" order={6} title="KPI 체크리스트">
              <TextListCard items={strategyData.kpiCheckList} />
            </StrategyAnalysisCard>

            <StrategyAnalysisCard id="improvementGuides" order={7} title="보완 가이드">
              <TextListCard
                items={strategyData.improvementGuides.map(
                  (item) => `${item.title}: ${item.description}`,
                )}
              />
            </StrategyAnalysisCard>
          </Accordion>
        )}
      </div>
    </section>
  );
}
