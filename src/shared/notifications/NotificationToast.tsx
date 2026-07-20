import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { notificationTypeStyles } from './notification-styles';
import type { NotificationItem } from './notification.types';

type NotificationToastProps = {
  item: NotificationItem;
  onDismiss: (id: string) => void;
  accent: 'rose' | 'brand';
};

export default function NotificationToast({ item, onDismiss, accent }: NotificationToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const styles = notificationTypeStyles[item.type];
  const accentProgress =
    item.type === 'success'
      ? accent === 'brand'
        ? 'bg-brand'
        : 'bg-rose-500'
      : styles.progress;

  const handleDismiss = () => {
    setIsExiting(true);
    window.setTimeout(() => onDismiss(item.id), 280);
  };

  useEffect(() => {
    if (item.duration <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setIsExiting(true);
      window.setTimeout(() => onDismiss(item.id), 280);
    }, item.duration);

    return () => window.clearTimeout(timer);
  }, [item.duration, item.id, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/60 bg-white/95 p-4 shadow-xl shadow-slate-900/10 ring-1 backdrop-blur-md',
        styles.ring,
        isExiting ? 'animate-notification-exit' : 'animate-notification-enter',
      ].join(' ')}
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sm',
            styles.iconBg,
            styles.iconColor,
          ].join(' ')}
        >
          <FontAwesomeIcon icon={styles.icon} className="h-4 w-4" />
        </div>

        <p className="min-w-0 flex-1 pt-1 text-sm font-medium leading-snug text-slate-800">
          {item.message}
        </p>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Fermer la notification"
          className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <FontAwesomeIcon icon="xmark" className="h-3.5 w-3.5" />
        </button>
      </div>

      {item.duration > 0 ? (
        <div className="absolute inset-x-0 bottom-0 h-1 overflow-hidden bg-slate-100">
          <div
            className={['h-full origin-left', accentProgress].join(' ')}
            style={{
              animation: `notification-progress ${item.duration}ms linear forwards`,
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
