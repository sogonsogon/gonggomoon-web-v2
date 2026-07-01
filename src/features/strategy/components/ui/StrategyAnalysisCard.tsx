import type { ReactNode } from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion';
import { cn } from '@/shared/lib/cn';

interface StrategyAnalysisCardProps {
  id: string;
  order: number;
  title: string;
  highlight?: boolean;
  children: ReactNode;
}

export default function StrategyAnalysisCard({
  id,
  order,
  title,
  highlight,
  children,
}: StrategyAnalysisCardProps) {
  return (
    <Card
      className={cn(
        'gap-0 rounded-[var(--radius-lg)] border-border py-0 shadow-none',
        highlight && 'border-primary/30 bg-primary/5',
      )}
    >
      <CardContent className="px-5 py-0">
        <AccordionItem value={id} className="border-b-0">
          <AccordionTrigger className="py-5 hover:no-underline cursor-pointer">
            <div className="flex min-w-0 items-center gap-2">
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full text-xs leading-none font-bold',
                  highlight
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-adaptive-grey-200 bg-muted text-muted-foreground',
                )}
              >
                {order}
              </span>
              <h2 className="min-w-0 text-base leading-[1.45] font-bold text-foreground break-keep break-words">
                {title}
              </h2>
            </div>
          </AccordionTrigger>

          <AccordionContent className="pb-5">{children}</AccordionContent>
        </AccordionItem>
      </CardContent>
    </Card>
  );
}
