import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/cn';

interface ExperienceListSkeletonProps {
  variant: 'checkbox' | 'view';
}

const skeletonItems = Array.from({ length: 3 }, (_, index) => index);

export default function ExperienceListSkeleton({ variant }: ExperienceListSkeletonProps) {
  const isCheckboxVariant = variant === 'checkbox';

  return (
    <>
      <span className="sr-only" role="status">
        경험 목록을 불러오는 중입니다.
      </span>
      <ul
        aria-hidden="true"
        className={cn(
          isCheckboxVariant
            ? 'grid gap-2'
            : 'divide-y divide-border/70 border-t border-border/70',
        )}
      >
        {skeletonItems.map((item) => (
          <li
            key={item}
            className={cn(
              'flex min-w-0 items-center bg-card',
              isCheckboxVariant
                ? 'rounded-[var(--radius-sm)] border border-border'
                : 'min-h-[86px]',
            )}
          >
            <div
              className={cn(
                'flex min-w-0 flex-1 items-center gap-3',
                isCheckboxVariant ? 'px-4 py-3' : 'px-4 py-5',
              )}
            >
              {isCheckboxVariant ? <Skeleton className="size-5 shrink-0 rounded-full" /> : null}
              <div className="grid min-w-0 flex-1 gap-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-12 rounded-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-2/3 max-w-[280px]" />
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 pr-3">
              {skeletonItems.map((action) => (
                <Skeleton key={action} className="size-8 rounded-md" />
              ))}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
