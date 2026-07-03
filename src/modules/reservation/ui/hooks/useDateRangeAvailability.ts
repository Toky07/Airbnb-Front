import { useCallback, useMemo } from 'react';
import {
  isBookingRangeAvailable,
  isDateInUnavailableRange,
  type DateRange,
} from '../../core/utils/date-range-availability';

export function useDateRangeAvailability(
  unavailableRanges: DateRange[],
  selectedStart?: string,
  selectedEnd?: string,
) {
  const isDateUnavailable = useCallback(
    (dateStr: string) => isDateInUnavailableRange(dateStr, unavailableRanges),
    [unavailableRanges],
  );

  const rangeAvailable = useMemo(
    () => isBookingRangeAvailable(selectedStart ?? '', selectedEnd ?? '', unavailableRanges),
    [selectedStart, selectedEnd, unavailableRanges],
  );

  return { isDateUnavailable, rangeAvailable };
}
