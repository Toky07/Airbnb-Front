export type DateRange = {
  startDate: string;
  endDate: string;
};

export function isDateInUnavailableRange(dateStr: string, ranges: DateRange[]): boolean {
  return ranges.some((range) => dateStr >= range.startDate && dateStr < range.endDate);
}

export function bookingRangeOverlapsUnavailable(
  startDate: string,
  endDate: string,
  range: DateRange,
): boolean {
  return startDate < range.endDate && endDate > range.startDate;
}

export function isBookingRangeAvailable(
  startDate: string,
  endDate: string,
  ranges: DateRange[],
): boolean {
  if (!startDate || !endDate) {
    return true;
  }

  return !ranges.some((range) => bookingRangeOverlapsUnavailable(startDate, endDate, range));
}

export function isCalendarDateDisabled(
  dateStr: string,
  ranges: DateRange[],
  selectedStart?: string,
  selectedEnd?: string,
): boolean {
  if (isDateInUnavailableRange(dateStr, ranges)) {
    return true;
  }

  if (selectedStart && !selectedEnd) {
    if (dateStr <= selectedStart) {
      return true;
    }

    return !isBookingRangeAvailable(selectedStart, dateStr, ranges);
  }

  return false;
}
