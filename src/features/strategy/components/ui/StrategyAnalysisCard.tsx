import { Badge } from '@/shared/components/ui/badge';
import { Card, CardContent } from '@/shared/components/ui/card';
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/accordion';
import { cn } from '@/shared/lib/cn';
import type { StrategyAnalysisCardData } from '@/features/strategy/constants/mock';

interface StrategyAnalysisCardProps {
  card: StrategyAnalysisCardData;
}

export default function StrategyAnalysisCard({ card }: StrategyAnalysisCardProps) {
  const isSummary = card.type === 'summary';

  return (
    <Card
      className={cn(
        'gap-0 rounded-[var(--radius-lg)] border-border py-0 shadow-none',
        isSummary && 'border-primary/30 bg-primary/5',
      )}
    >
      <CardContent className="px-5 py-0">
        <AccordionItem value={card.id} className="border-b-0">
          <AccordionTrigger className="py-5 hover:no-underline">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full text-xs leading-none font-bold',
                  isSummary
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-adaptive-grey-200 bg-muted text-muted-foreground',
                )}
              >
                {card.order}
              </span>
              <h2 className="min-w-0 text-base leading-[1.45] font-bold text-foreground break-keep break-words">
                {card.title}
              </h2>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pb-5">
            {card.type === 'summary' ? (
              <p className="text-sm leading-[1.7] text-foreground break-keep break-words">
                {card.content}
              </p>
            ) : null}

            {card.type === 'list' ? (
              <ul className="grid gap-2">
                {card.items.map((item) => (
                  <li
                    key={item}
                    className="flex min-w-0 gap-2 text-sm leading-[1.65] text-muted-foreground"
                  >
                    <span className="mt-[0.75em] size-1 shrink-0 rounded-full bg-primary" />
                    <span className="min-w-0 break-keep break-words">{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}

            {card.type === 'keywords' ? (
              <div className="flex flex-wrap gap-2">
                {card.keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="outline"
                    className="border-primary/30 bg-primary/10 text-primary"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            ) : null}
          </AccordionContent>
        </AccordionItem>
      </CardContent>
    </Card>
  );
}
