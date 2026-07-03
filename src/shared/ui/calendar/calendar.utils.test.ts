import { describe, expect, it } from 'vitest';
import {
  formatCalendarDateStr,
  getInitialViewDate,
  isDateInSelectedRange,
  resolveRangeSelection,
  shiftViewMonth,
} from './calendar.utils';

describe('calendar.utils', () => {
  it('formate une date calendrier', () => {
    expect(formatCalendarDateStr(2026, 8, 5)).toBe('2026-09-05');
  });

  it('initialise la vue sur la date de début sélectionnée', () => {
    expect(getInitialViewDate('2026-09-15')).toEqual({ year: 2026, month: 8 });
  });

  it('décale le mois affiché', () => {
    expect(shiftViewMonth({ year: 2026, month: 0 }, -1)).toEqual({ year: 2025, month: 11 });
    expect(shiftViewMonth({ year: 2026, month: 11 }, 1)).toEqual({ year: 2027, month: 0 });
  });

  it('détecte une date dans la plage sélectionnée', () => {
    expect(isDateInSelectedRange('2026-09-02', '2026-09-01', '2026-09-04')).toBe(true);
    expect(isDateInSelectedRange('2026-09-01', '2026-09-01', '2026-09-04')).toBe(false);
  });

  it('résout la sélection arrivée puis départ', () => {
    expect(resolveRangeSelection('2026-09-01', '', false)).toEqual({
      start: '2026-09-01',
      end: '',
      selectingEnd: true,
    });

    expect(resolveRangeSelection('2026-09-05', '2026-09-01', true)).toEqual({
      start: '2026-09-01',
      end: '2026-09-05',
      selectingEnd: false,
    });
  });
});
