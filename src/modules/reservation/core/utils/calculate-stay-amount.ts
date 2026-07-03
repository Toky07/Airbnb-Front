import { isBookingRangeAvailable } from './date-range-availability';

export type StayAmountPreview = {
  nights: number;
  totalPrice: number;
};

export type DefaultBookingDates = {
  startDate: string;
  endDate: string;
};

export function getDefaultBookingDates(
  referenceDate: Date = new Date(),
): DefaultBookingDates {
  const start = new Date(referenceDate);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() + 1);

  const end = new Date(start);
  end.setDate(end.getDate() + 1);

  return {
    startDate: formatDateInputValue(start),
    endDate: formatDateInputValue(end),
  };
}

export function getFirstAvailableDates(
  unavailableRanges: Array<{ startDate: string; endDate: string }>,
  referenceDate: Date = new Date(),
): DefaultBookingDates {
  const cursor = new Date(referenceDate);
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);

  const maxAttempts = 365;

  for (let i = 0; i < maxAttempts; i++) {
    const startStr = formatDateInputValue(cursor);
    const next = new Date(cursor);
    next.setDate(next.getDate() + 1);
    const endStr = formatDateInputValue(next);

    if (isBookingRangeAvailable(startStr, endStr, unavailableRanges)) {
      return { startDate: startStr, endDate: endStr };
    }

    cursor.setDate(cursor.getDate() + 1);
  }

  return getDefaultBookingDates(referenceDate);
}

function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateStayAmountPreview(
  startDate: string,
  endDate: string,
  pricePerNight: number,
): StayAmountPreview | null {
  if (!startDate || !endDate || pricePerNight <= 0) {
    return null;
  }

  const checkIn = parseDate(startDate);
  const checkOut = parseDate(endDate);

  if (!checkIn || !checkOut || checkOut <= checkIn) {
    return null;
  }

  const nights = countNights(checkIn, checkOut);
  if (nights < 1) {
    return null;
  }

  return {
    nights,
    totalPrice: Number((nights * pricePerNight).toFixed(2)),
  };
}

function parseDate(value: string): Date | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function countNights(checkIn: Date, checkOut: Date): number {
  const millisecondsPerDay = 24 * 60 * 60 * 1000;
  return Math.round((checkOut.getTime() - checkIn.getTime()) / millisecondsPerDay);
}
