export const WEEKDAY_LABELS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
export const MONTH_LABELS = [
  'Janvier',
  'Février',
  'Mars',
  'Avril',
  'Mai',
  'Juin',
  'Juillet',
  'Août',
  'Septembre',
  'Octobre',
  'Novembre',
  'Décembre',
];

export type CalendarViewDate = {
  year: number;
  month: number;
};

export function formatCalendarDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function toLocalCalendarDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function getTodayDateStr(referenceDate: Date = new Date()): string {
  return formatCalendarDateStr(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    referenceDate.getDate(),
  );
}

export function getInitialViewDate(selectedStart?: string, referenceDate: Date = new Date()): CalendarViewDate {
  if (selectedStart) {
    const date = toLocalCalendarDate(selectedStart);
    return { year: date.getFullYear(), month: date.getMonth() };
  }

  return {
    year: referenceDate.getFullYear(),
    month: referenceDate.getMonth(),
  };
}

export function shiftViewMonth(viewDate: CalendarViewDate, delta: -1 | 1): CalendarViewDate {
  if (delta === -1) {
    if (viewDate.month === 0) {
      return { year: viewDate.year - 1, month: 11 };
    }
    return { year: viewDate.year, month: viewDate.month - 1 };
  }

  if (viewDate.month === 11) {
    return { year: viewDate.year + 1, month: 0 };
  }
  return { year: viewDate.year, month: viewDate.month + 1 };
}

export function getDaysInMonth(viewDate: CalendarViewDate): number {
  return new Date(viewDate.year, viewDate.month + 1, 0).getDate();
}

export function getFirstDayOfWeek(viewDate: CalendarViewDate): number {
  return (new Date(viewDate.year, viewDate.month, 1).getDay() + 6) % 7;
}

export function canNavigateToPreviousMonth(
  viewDate: CalendarViewDate,
  minDate: string,
): boolean {
  const min = toLocalCalendarDate(minDate);
  return (
    viewDate.year > min.getFullYear() ||
    (viewDate.year === min.getFullYear() && viewDate.month > min.getMonth())
  );
}

export function isDateInSelectedRange(
  dateStr: string,
  selectedStart: string,
  selectedEnd: string,
): boolean {
  if (!selectedStart || !selectedEnd) {
    return false;
  }

  return dateStr > selectedStart && dateStr < selectedEnd;
}

export function resolveRangeSelection(
  dateStr: string,
  selectedStart: string,
  selectingEnd: boolean,
): { start: string; end: string; selectingEnd: boolean } {
  if (!selectingEnd || !selectedStart || dateStr < selectedStart) {
    return { start: dateStr, end: '', selectingEnd: true };
  }

  return { start: selectedStart, end: dateStr, selectingEnd: false };
}

export function isCalendarDayDisabled(
  dateStr: string,
  minDate: string,
  isDateDisabled?: (dateStr: string) => boolean,
): boolean {
  return dateStr < minDate || (isDateDisabled?.(dateStr) ?? false);
}
