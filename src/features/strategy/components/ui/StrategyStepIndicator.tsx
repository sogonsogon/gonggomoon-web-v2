import { STRATEGY_STEPS } from '@/features/strategy/constants/step';
import { cn } from '@/shared/lib/cn';

type StrategyStep = (typeof STRATEGY_STEPS)[number]['value'];

interface StrategyStepIndicatorProps {
  currentStep?: StrategyStep;
}

interface StrategyStepItemProps {
  stepNumber: number;
  stepName: string;
  isActive: boolean;
  isCompleted: boolean;
}

export default function StrategyStepIndicator({
  currentStep = 'analysis',
}: StrategyStepIndicatorProps) {
  const currentIndex = STRATEGY_STEPS.findIndex((step) => step.value === currentStep);

  return (
    <nav
      aria-label="전략 생성 단계"
      className="flex h-20 md:h-24 w-full items-center justify-center px-5 md:px-10"
    >
      <ol className="grid w-full max-w-160 list-none grid-cols-[max-content_minmax(24px,1fr)_max-content_minmax(24px,1fr)_max-content] items-center">
        {STRATEGY_STEPS.map((step, index) => {
          const isActive = step.value === currentStep;
          const isCompleted = index < currentIndex;

          return (
            <StrategyStepFragment
              key={step.value}
              stepNumber={index + 1}
              stepName={step.label}
              isActive={isActive}
              isCompleted={isCompleted}
              showConnector={index < STRATEGY_STEPS.length - 1}
            />
          );
        })}
      </ol>
    </nav>
  );
}

function StrategyStepFragment({
  stepNumber,
  stepName,
  isActive,
  isCompleted,
  showConnector,
}: StrategyStepItemProps & { showConnector: boolean }) {
  return (
    <>
      <StrategyStepItem
        stepNumber={stepNumber}
        stepName={stepName}
        isActive={isActive}
        isCompleted={isCompleted}
      />
      {showConnector ? (
        <li
          className="flex min-w-6 items-center justify-center px-4 md:px-8 "
          aria-hidden="true"
          role="presentation"
        >
          <span className={cn('h-px w-full bg-border', isCompleted && 'bg-primary/40')} />
        </li>
      ) : null}
    </>
  );
}

function StrategyStepItem({ stepNumber, stepName, isActive, isCompleted }: StrategyStepItemProps) {
  return (
    <li className="flex min-w-0 items-center justify-center">
      <div className="flex min-w-0 items-center justify-center gap-2">
        <span
          className={cn(
            'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] leading-none font-bold',
            isActive || isCompleted
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground',
          )}
          aria-current={isActive ? 'step' : undefined}
        >
          {stepNumber}
        </span>
        <span
          className={cn(
            'shrink-0 text-sm font-bold whitespace-nowrap',
            isActive ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          {stepName}
        </span>
      </div>
    </li>
  );
}
