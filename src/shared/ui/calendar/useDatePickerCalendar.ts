import { useCallback, useMemo, useState } from 'react';
import {
  canNavigateToPreviousMonth,
  getDaysInMonth,
  getFirstDayOfWeek,
  getInitialViewDate,
  getTodayDateStr,
  isCalendarDayDisabled,
  isDateInSelectedRange,
  resolveRangeSelection,
  shiftViewMonth,
  type CalendarViewDate,
} from './calendar.utils';

export type UseDatePickerCalendarOptions = {
  selectedStart: string;
  selectedEnd: string;
  onSelectStart: (date: string) => void;
  onSelectEnd: (date: string) => void;
  isDateDisabled?: (dateStr: string) => boolean;
  minDate?: string;
  referenceDate?: Date;
};

export function useDatePickerCalendar({
  selectedStart,
  selectedEnd,
  onSelectStart,
  onSelectEnd,
  isDateDisabled,
  minDate,
  referenceDate = new Date(),
}: UseDatePickerCalendarOptions) {
  const today = useMemo(() => getTodayDateStr(referenceDate), [referenceDate]);
  const effectiveMin = minDate ?? today;

  const [viewDate, setViewDate] = useState<CalendarViewDate>(() =>
    getInitialViewDate(selectedStart, referenceDate),
  );
  const [selectingEnd, setSelectingEnd] = useState(false);

  const prevMonth = useCallback(() => {
    setViewDate((current) => shiftViewMonth(current, -1));
  }, []);

  const nextMonth = useCallback(() => {
    setViewDate((current) => shiftViewMonth(current, 1));
  }, []);

  const handleDayClick = useCallback(
    (dateStr: string) => {
      if (isCalendarDayDisabled(dateStr, effectiveMin, isDateDisabled)) {
        return;
      }

      const selection = resolveRangeSelection(dateStr, selectedStart, selectingEnd);
      onSelectStart(selection.start);
      onSelectEnd(selection.end);
      setSelectingEnd(selection.selectingEnd);
    },
    [effectiveMin, isDateDisabled, onSelectEnd, onSelectStart, selectedStart, selectingEnd],
  );

  const isInRange = useCallback(
    (dateStr: string) => isDateInSelectedRange(dateStr, selectedStart, selectedEnd),
    [selectedEnd, selectedStart],
  );

  const isDayDisabled = useCallback(
    (dateStr: string) => isCalendarDayDisabled(dateStr, effectiveMin, isDateDisabled),
    [effectiveMin, isDateDisabled],
  );

  const canGoPrev = useMemo(
    () => canNavigateToPreviousMonth(viewDate, effectiveMin),
    [effectiveMin, viewDate],
  );

  return {
    viewDate,
    today,
    effectiveMin,
    selectingEnd,
    daysInMonth: getDaysInMonth(viewDate),
    firstDayOfWeek: getFirstDayOfWeek(viewDate),
    prevMonth,
    nextMonth,
    handleDayClick,
    isInRange,
    isDayDisabled,
    canGoPrev,
  };
}
