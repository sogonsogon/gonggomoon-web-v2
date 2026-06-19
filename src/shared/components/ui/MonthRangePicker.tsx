'use client';

import * as React from 'react';

import MonthPicker, { isMonthBefore } from '@/shared/components/ui/MonthPicker';

export interface MonthRangeValue {
  startMonth: string | null;
  endMonth: string | null;
  ongoing: boolean;
}

interface MonthRangePickerProps {
  startMonth: string | null;
  endMonth: string | null;
  ongoing?: boolean;
  onRangeChange: (range: MonthRangeValue) => void;
  allowOngoing?: boolean;
}

export default function MonthRangePicker({
  startMonth,
  endMonth,
  ongoing = false,
  onRangeChange,
  allowOngoing = false,
}: MonthRangePickerProps) {
  const handleStartMonthChange = React.useCallback(
    (nextStartMonth: string | null) => {
      const endMonthInvalid = Boolean(
        nextStartMonth && endMonth && isMonthBefore(endMonth, nextStartMonth),
      );

      onRangeChange({
        startMonth: nextStartMonth,
        endMonth: endMonthInvalid ? null : endMonth,
        ongoing: endMonthInvalid ? false : ongoing,
      });
    },
    [endMonth, ongoing, onRangeChange],
  );

  const handleEndMonthChange = React.useCallback(
    (nextEndMonth: string | null) => {
      if (nextEndMonth === null) {
        return;
      }

      onRangeChange({
        startMonth,
        endMonth: nextEndMonth,
        ongoing: false,
      });
    },
    [onRangeChange, startMonth],
  );

  const handleOngoingSelect = React.useCallback(() => {
    if (!allowOngoing) {
      return;
    }

    onRangeChange({
      startMonth,
      endMonth: null,
      ongoing: true,
    });
  }, [allowOngoing, onRangeChange, startMonth]);

  return (
    <div className="grid grid-cols-2 gap-2">
      <MonthPicker value={startMonth} placeholder="시작월" onValueChange={handleStartMonthChange} />
      <MonthPicker
        value={endMonth}
        allowEmpty={allowOngoing}
        emptySelected={ongoing}
        placeholder="종료월"
        minMonth={startMonth ?? undefined}
        onValueChange={handleEndMonthChange}
        onEmptySelect={handleOngoingSelect}
      />
    </div>
  );
}
