export function formatBookingDate(value: string): string {
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatBookingDateRange(startDate: string, endDate: string): string {
  return `${formatBookingDate(startDate)} → ${formatBookingDate(endDate)}`;
}
