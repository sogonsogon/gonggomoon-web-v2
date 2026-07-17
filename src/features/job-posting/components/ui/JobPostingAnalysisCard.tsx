import { Card, CardContent } from '@/shared/components/ui/card';
import { Separator } from '@/shared/components/ui/separator';
import type { JobPostingAnalysis } from '@/features/job-posting/types';

interface JobPostingAnalysisCardProps {
  analysis: JobPostingAnalysis;
}

export default function JobPostingAnalysisCard({ analysis }: JobPostingAnalysisCardProps) {
  const sections = [
    { title: 'R&R(역할과 책임)', items: analysis.summary.rnr },
    { title: '필수 역량', items: analysis.summary.required_skills },
    { title: '우대 조건', items: analysis.summary.differentiators },
    { title: '주요 키워드', items: analysis.summary.hidden_keywords },
  ];

  return (
    <Card className="gap-0 overflow-hidden rounded-[var(--radius-lg)] border-border/70 py-0 shadow-none">
      <CardContent className="px-5 py-5">
        <div className="rounded-[var(--radius-sm)] bg-primary/5 px-4 py-3">
          <h2 className="text-sm leading-[1.45] font-bold text-primary">공고 한줄 요약</h2>
          <p className="mt-1 text-sm leading-[1.6] text-foreground break-keep break-words">
            {analysis.summary.summary}
          </p>
        </div>

        <div className="mt-5">
          {sections.map((section, index) => (
            <div key={section.title}>
              <div className="grid gap-3 py-4 md:grid-cols-[160px_1fr] md:gap-5">
                <div className="flex h-fit">
                  <span className="w-1 rounded-sm bg-primary" />
                  <h3 className="pl-3 text-sm leading-[1.45] font-bold text-foreground">
                    {section.title}
                  </h3>
                </div>
                <ul className="grid min-w-0 gap-1.5 text-sm leading-[1.6] text-muted-foreground">
                  {section.items.map((item) => (
                    <li key={item} className="flex min-w-0 gap-2">
                      <span className="mt-[0.65em] size-1 shrink-0 rounded-full bg-primary" />
                      <span className="min-w-0 break-keep break-words">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {index < sections.length - 1 ? <Separator /> : null}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
