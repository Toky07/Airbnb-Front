import { useEffect } from 'react';

const POLLING_INTERVAL_MS = 30_000;

export function useConversationPolling(
  refresh: () => Promise<void>,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timer = window.setInterval(() => {
      void refresh();
    }, POLLING_INTERVAL_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [enabled, refresh]);
}
