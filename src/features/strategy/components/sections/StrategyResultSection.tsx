'use client';
import StrategyAnalysisCard from '@/features/strategy/components/ui/StrategyAnalysisCard';
import StrategyResultActions from '@/features/strategy/components/ui/StrategyResultActions';
import { useGetStrategy } from '@/features/strategy/queries';
import { Accordion } from '@/shared/components/ui/accordion';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';

interface StrategyResultSectionProps {
  strategyId: string;
}

interface TextListCardProps {
  items: string[];
}

interface DetailListCardProps {
  items: Array<{
    title: string;
    description: string;
  }>;
  numbered?: boolean;
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
                {strategyData.createdAt.slice(0, 10).replace(/-/g, '.')}
              </p>
              <h1 className="mt-1 text-2xl leading-tight font-bold tracking-normal text-foreground break-keep md:text-[28px]">
                {strategyData.postAnalysisTitle}
              </h1>
              <p className="mt-2 max-w-155 text-sm leading-[1.6] text-muted-foreground break-keep wrap-break-word">
                공고 분석 내용과 선택된 경험 기반으로 생성된 포트폴리오 전략을 확인해보세요
              </p>
            </div>
          )}
          {isLoading ? (
            <Skeleton className="h-10 w-full max-w-[200px] rounded-lg" />
          ) : isError || !strategyData ? null : (
            <StrategyResultActions strategy={strategyData} />
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
            <StrategyAnalysisCard id="improvementGuides" order={2} title="보완 가이드">
              <DetailListCard
                items={strategyData.improvementGuides.map((item) => ({
                  title: item.title,
                  description: item.description,
                }))}
              />
            </StrategyAnalysisCard>
            <StrategyAnalysisCard id="experienceStrategyPoints" order={3} title="경험별 포인트">
              <DetailListCard
                items={strategyData.experienceStrategyPoints.map((item) => ({
                  title: item.experienceTitle,
                  description: item.strategyPoint,
                }))}
              />
            </StrategyAnalysisCard>
            <StrategyAnalysisCard id="experienceOrdering" order={4} title="경험 정렬 전략">
              <DetailListCard
                numbered
                items={strategyData.experienceOrdering
                  .slice()
                  .sort((a, b) => a.order - b.order)
                  .map((item) => ({ title: item.title, description: item.reason }))}
              />
            </StrategyAnalysisCard>
            <StrategyAnalysisCard id="keywords" order={5} title="강조 키워드">
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
            <StrategyAnalysisCard id="strengths" order={6} title="강조 역량">
              <TextListCard items={strategyData.strengths} />
            </StrategyAnalysisCard>
            <StrategyAnalysisCard id="kpiCheckList" order={7} title="KPI(핵심 성과 지표)">
              <TextListCard items={strategyData.kpiCheckList} />
            </StrategyAnalysisCard>
          </Accordion>
        )}
      </div>
    </section>
  );
}

function DetailListCard({ items, numbered = false }: DetailListCardProps) {
  const List = numbered ? 'ol' : 'ul';

  return (
    <List className="grid gap-3">
      {items.map((item, index) => (
        <li key={`${item.title}-${item.description}`} className="flex min-w-0 gap-2">
          {numbered ? (
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs leading-none font-semibold text-primary">
              {index + 1}
            </span>
          ) : (
            <span className="mt-[0.65em] size-1 shrink-0 rounded-full bg-primary" />
          )}
          <div className="min-w-0">
            <p className="text-sm leading-[1.5] font-semibold text-foreground break-keep break-words">
              {item.title}
            </p>
            <p className="mt-1 text-sm leading-[1.65] text-muted-foreground break-keep break-words">
              {item.description}
            </p>
          </div>
        </li>
      ))}
    </List>
  );
}

function TextListCard({ items }: TextListCardProps) {
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item} className="flex min-w-0 gap-2 text-sm leading-[1.65] text-muted-foreground">
          <span className="mt-[0.75em] size-1 shrink-0 rounded-full bg-primary" />
          <span className="min-w-0 break-keep break-words">{item}</span>
        </li>
      ))}
    </ul>
  );
}
