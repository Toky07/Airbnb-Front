import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useConversationPolling } from './useConversationPolling';

describe('useConversationPolling', () => {
  it('calls refresh on the configured interval', () => {
    vi.useFakeTimers();
    const refresh = vi.fn().mockResolvedValue(undefined);

    renderHook(() => useConversationPolling(refresh, true));

    expect(refresh).not.toHaveBeenCalled();
    vi.advanceTimersByTime(30_000);
    expect(refresh).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
