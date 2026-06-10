import { useCallback, useMemo, useState } from 'react';

type DatePickerCalendarProps = {
  selectedStart: string;
  selectedEnd: string;
  onSelectStart: (date: string) => void;
  onSelectEnd: (date: string) => void;
  isDateDisabled?: (dateStr: string) => boolean;
  minDate?: string;
};

const WEEKDAY_LABELS = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];
const MONTH_LABELS = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

function formatDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function toLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d);
}

const DatePickerCalendar = ({
  selectedStart,
  selectedEnd,
  onSelectStart,
  onSelectEnd,
  isDateDisabled,
  minDate,
}: DatePickerCalendarProps) => {
  const today = useMemo(() => {
    const d = new Date();
    return formatDateStr(d.getFullYear(), d.getMonth(), d.getDate());
  }, []);

  const effectiveMin = minDate ?? today;

  const [viewDate, setViewDate] = useState(() => {
    if (selectedStart) {
      const d = toLocalDate(selectedStart);
      return { year: d.getFullYear(), month: d.getMonth() };
    }
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const [selectingEnd, setSelectingEnd] = useState(false);

  const prevMonth = useCallback(() => {
    setViewDate((v) => {
      if (v.month === 0) return { year: v.year - 1, month: 11 };
      return { year: v.year, month: v.month - 1 };
    });
  }, []);

  const nextMonth = useCallback(() => {
    setViewDate((v) => {
      if (v.month === 11) return { year: v.year + 1, month: 0 };
      return { year: v.year, month: v.month + 1 };
    });
  }, []);

  const daysInMonth = new Date(viewDate.year, viewDate.month + 1, 0).getDate();
  const firstDayOfWeek = (new Date(viewDate.year, viewDate.month, 1).getDay() + 6) % 7;

  const handleDayClick = (dateStr: string) => {
    if (isDateDisabled?.(dateStr)) return;
    if (dateStr < effectiveMin) return;

    if (!selectingEnd || !selectedStart || dateStr < selectedStart) {
      onSelectStart(dateStr);
      onSelectEnd('');
      setSelectingEnd(true);
    } else {
      onSelectEnd(dateStr);
      setSelectingEnd(false);
    }
  };

  const isInRange = (dateStr: string): boolean => {
    if (!selectedStart || !selectedEnd) return false;
    return dateStr > selectedStart && dateStr < selectedEnd;
  };

  const canGoPrev = useMemo(() => {
    const minD = toLocalDate(effectiveMin);
    return viewDate.year > minD.getFullYear() ||
      (viewDate.year === minD.getFullYear() && viewDate.month > minD.getMonth());
  }, [viewDate, effectiveMin]);

  return (
    <div className="select-none">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Mois précédent"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-slate-900">
          {MONTH_LABELS[viewDate.month]} {viewDate.year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
          aria-label="Mois suivant"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0">
        {WEEKDAY_LABELS.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-slate-400">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDateStr(viewDate.year, viewDate.month, day);
          const disabled = dateStr < effectiveMin || (isDateDisabled?.(dateStr) ?? false);
          const isStart = dateStr === selectedStart;
          const isEnd = dateStr === selectedEnd;
          const inRange = isInRange(dateStr);
          const isToday = dateStr === today;

          let className =
            'relative flex h-9 w-full items-center justify-center text-sm transition-colors ';

          if (disabled) {
            className += 'text-slate-300 line-through cursor-not-allowed ';
          } else if (isStart || isEnd) {
            className += 'bg-brand text-white font-semibold rounded-lg z-10 ';
          } else if (inRange) {
            className += 'bg-brand/10 text-brand font-medium ';
          } else {
            className += 'text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer ';
            if (isToday) {
              className += 'font-bold ';
            }
          }

          return (
            <button
              key={dateStr}
              type="button"
              disabled={disabled}
              onClick={() => handleDayClick(dateStr)}
              className={className.trim()}
              aria-label={dateStr}
              data-testid={`calendar-day-${dateStr}`}
            >
              {day}
              {isToday && !isStart && !isEnd ? (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-brand" />
              ) : null}
            </button>
          );
        })}
      </div>

      {selectingEnd && selectedStart ? (
        <p className="mt-3 text-center text-xs text-slate-500">
          Sélectionnez une date de départ
        </p>
      ) : null}
    </div>
  );
};

export default DatePickerCalendar;
