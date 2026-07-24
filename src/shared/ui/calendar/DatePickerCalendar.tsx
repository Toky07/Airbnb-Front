import {
  formatCalendarDateStr,
  MONTH_LABELS,
  WEEKDAY_LABELS,
} from './calendar.utils';
import { useDatePickerCalendar } from './useDatePickerCalendar';

type DatePickerCalendarProps = {
  selectedStart: string;
  selectedEnd: string;
  onSelectStart: (date: string) => void;
  onSelectEnd: (date: string) => void;
  isDateDisabled?: (dateStr: string) => boolean;
  minDate?: string;
};

const DatePickerCalendar = ({
  selectedStart,
  selectedEnd,
  onSelectStart,
  onSelectEnd,
  isDateDisabled,
  minDate,
}: DatePickerCalendarProps) => {
  const {
    viewDate,
    today,
    selectingEnd,
    daysInMonth,
    firstDayOfWeek,
    prevMonth,
    nextMonth,
    handleDayClick,
    isInRange,
    isDayDisabled,
    canGoPrev,
  } = useDatePickerCalendar({
    selectedStart,
    selectedEnd,
    onSelectStart,
    onSelectEnd,
    isDateDisabled,
    minDate,
  });

  return (
    <div className="select-none">
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-ink/50 transition duration-200 hover:bg-mist disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Mois précédent"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-ink">
          {MONTH_LABELS[viewDate.month]} {viewDate.year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-xl text-ink/50 transition duration-200 hover:bg-mist"
          aria-label="Mois suivant"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0">
        {WEEKDAY_LABELS.map((day) => (
          <div key={day} className="py-2 text-center text-xs font-medium text-ink/40">
            {day}
          </div>
        ))}

        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatCalendarDateStr(viewDate.year, viewDate.month, day);
          const disabled = isDayDisabled(dateStr);
          const isStart = dateStr === selectedStart;
          const isEnd = dateStr === selectedEnd;
          const inRange = isInRange(dateStr);
          const isToday = dateStr === today;

          let className =
            'relative flex h-9 w-full items-center justify-center text-sm transition-colors ';

          if (disabled) {
            className += 'text-ink/25 line-through cursor-not-allowed ';
          } else if (isStart || isEnd) {
            className += 'bg-brand text-white font-semibold rounded-xl z-10 ';
          } else if (inRange) {
            className += 'bg-brand/10 text-brand font-medium ';
          } else {
            className += 'text-ink/80 hover:bg-mist rounded-xl cursor-pointer ';
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
        <p className="mt-3 text-center text-xs text-ink/50">
          Sélectionnez une date de départ
        </p>
      ) : null}
    </div>
  );
};

export default DatePickerCalendar;
