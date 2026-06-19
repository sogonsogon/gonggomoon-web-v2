'use client';

import * as React from 'react';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { cn } from '@/shared/lib/cn';

export type MonthValue = `${number}.${string}`;

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

interface MonthPickerProps {
  value: string | null;
  onValueChange: (value: string | null) => void;
  allowEmpty?: boolean;
  emptySelected?: boolean;
  onEmptySelect?: () => void;
  placeholder?: string;
  minMonth?: string;
  maxMonth?: string;
  disabled?: boolean;
  className?: string;
}

export default function MonthPicker({
  value,
  onValueChange,
  allowEmpty = false,
  emptySelected = false,
  onEmptySelect,
  placeholder = '월 선택',
  minMonth,
  maxMonth = getCurrentMonthValue(),
  disabled = false,
  className,
}: MonthPickerProps) {
  const [open, setOpen] = React.useState(false);
  const [displayYear, setDisplayYear] = React.useState(() =>
    getInitialDisplayYear(value, maxMonth),
  );

  const minIndex = getMonthIndex(minMonth);
  const maxIndex = getMonthIndex(maxMonth);
  const previousYearLastMonthIndex = (displayYear - 1) * 12 + 12;
  const nextYearFirstMonthIndex = (displayYear + 1) * 12 + 1;
  const previousYearDisabled = minIndex !== null && previousYearLastMonthIndex < minIndex;
  const nextYearDisabled = maxIndex !== null && nextYearFirstMonthIndex > maxIndex;

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setDisplayYear(getInitialDisplayYear(value, maxMonth));
    }

    setOpen(nextOpen);
  };

  const handleSelect = (month: number) => {
    const nextValue = formatMonthValue(displayYear, month);

    if (isMonthDisabled(nextValue, minMonth, maxMonth)) {
      return;
    }

    onValueChange(nextValue);
    setOpen(false);
  };

  const handleEmpty = () => {
    onValueChange(null);
    onEmptySelect?.();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            'h-9 w-full justify-between bg-card px-3 text-left text-sm font-normal',
            !value && 'text-muted-foreground',
            className,
          )}
          disabled={disabled}
        >
          <span className="truncate">
            {value ?? (allowEmpty && emptySelected ? '진행 중' : placeholder)}
          </span>
          <CalendarIcon className="size-4 text-muted-foreground" aria-hidden="true" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[248px] border-border/60 p-2.5">
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="이전 연도"
              disabled={previousYearDisabled}
              onClick={() => setDisplayYear((currentYear) => currentYear - 1)}
            >
              <ChevronLeftIcon className="size-4" aria-hidden="true" />
            </Button>
            <div className="text-sm font-semibold leading-[1.4] text-foreground">
              {displayYear}년
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="다음 연도"
              disabled={nextYearDisabled}
              onClick={() => setDisplayYear((currentYear) => currentYear + 1)}
            >
              <ChevronRightIcon className="size-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS.map((month) => {
              const monthValue = formatMonthValue(displayYear, month);
              const selected = value === monthValue;
              const monthDisabled = isMonthDisabled(monthValue, minMonth, maxMonth);

              return (
                <Button
                  key={month}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 border border-transparent px-1.5 text-xs',
                    selected && 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/10',
                    !selected && 'hover:bg-adaptive-grey-100 hover:text-foreground',
                    monthDisabled && 'text-muted-foreground/50',
                  )}
                  disabled={monthDisabled}
                  onClick={() => handleSelect(month)}
                >
                  {month}월
                </Button>
              );
            })}
          </div>

          {allowEmpty ? (
            <Button type="button" variant="outline" size="sm" onClick={handleEmpty}>
              진행 중
            </Button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );
}

//
export function getCurrentMonthValue() {
  const today = new Date();

  return formatMonthValue(today.getFullYear(), today.getMonth() + 1);
}

export function formatMonthValue(year: number, month: number) {
  return `${year}.${String(month).padStart(2, '0')}`;
}

export function getMonthIndex(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const [yearText, monthText] = value.split('.');
  const year = Number(yearText);
  const month = Number(monthText);

  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    return null;
  }

  return year * 12 + month;
}

export function isMonthBefore(left: string, right: string) {
  const leftIndex = getMonthIndex(left);
  const rightIndex = getMonthIndex(right);

  if (leftIndex === null || rightIndex === null) {
    return false;
  }

  return leftIndex < rightIndex;
}

function getInitialDisplayYear(value: string | null, maxMonth: string) {
  const source = value ?? maxMonth;
  const [yearText] = source.split('.');
  const year = Number(yearText);

  return Number.isInteger(year) ? year : new Date().getFullYear();
}

function isMonthDisabled(monthValue: string, minMonth?: string, maxMonth?: string) {
  const monthIndex = getMonthIndex(monthValue);
  const minIndex = getMonthIndex(minMonth);
  const maxIndex = getMonthIndex(maxMonth);

  if (monthIndex === null) {
    return true;
  }

  if (minIndex !== null && monthIndex < minIndex) {
    return true;
  }

  if (maxIndex !== null && monthIndex > maxIndex) {
    return true;
  }

  return false;
}
