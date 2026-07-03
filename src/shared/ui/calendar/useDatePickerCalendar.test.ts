import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useDatePickerCalendar } from './useDatePickerCalendar';

describe('useDatePickerCalendar', () => {
  it('sélectionne une plage arrivée puis départ', () => {
    const onSelectStart = vi.fn();
    const onSelectEnd = vi.fn();

    const { result, rerender } = renderHook(
      (props: {
        selectedStart: string;
        selectedEnd: string;
      }) =>
        useDatePickerCalendar({
          ...props,
          onSelectStart,
          onSelectEnd,
          referenceDate: new Date('2026-06-01T12:00:00'),
        }),
      {
        initialProps: {
          selectedStart: '',
          selectedEnd: '',
        },
      },
    );

    act(() => {
      result.current.handleDayClick('2026-09-01');
    });

    expect(onSelectStart).toHaveBeenCalledWith('2026-09-01');
    expect(onSelectEnd).toHaveBeenCalledWith('');

    rerender({
      selectedStart: '2026-09-01',
      selectedEnd: '',
    });

    act(() => {
      result.current.handleDayClick('2026-09-05');
    });

    expect(onSelectEnd).toHaveBeenLastCalledWith('2026-09-05');
  });
});
