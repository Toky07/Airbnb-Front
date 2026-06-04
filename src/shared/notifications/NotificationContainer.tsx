import {
  faCheck,
  faCircleInfo,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import type { NotificationItem, NotificationType } from './notification.types';

type NotificationContainerProps = {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
  accent?: 'rose' | 'brand';
};

const typeStyles: Record<
  NotificationType,
  { icon: typeof faCheck; ring: string; iconBg: string; iconColor: string; progress: string }
> = {
  success: {
    icon: faCheck,
    ring: 'ring-emerald-100',
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
    progress: 'bg-emerald-500',
  },
  error: {
    icon: faXmark,
    ring: 'ring-red-100',
    iconBg: 'bg-red-500',
    iconColor: 'text-white',
    progress: 'bg-red-500',
  },
  info: {
    icon: faCircleInfo,
    ring: 'ring-sky-100',
    iconBg: 'bg-sky-500',
    iconColor: 'text-white',
    progress: 'bg-sky-500',
  },
  warning: {
    icon: faTriangleExclamation,
    ring: 'ring-amber-100',
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    progress: 'bg-amber-500',
  },
};

function NotificationToast({
  item,
  onDismiss,
  accent,
}: {
  item: NotificationItem;
  onDismiss: (id: string) => void;
  accent: 'rose' | 'brand';
}) {
  const [isExiting, setIsExiting] = useState(false);
  const styles = typeStyles[item.type];
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
          <FontAwesomeIcon icon={faXmark} className="h-3.5 w-3.5" />
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

export default function NotificationContainer({
  notifications,
  onDismiss,
  accent = 'brand',
}: NotificationContainerProps) {
  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Notifications"
      className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex flex-col items-end gap-3 px-4 sm:top-6 sm:px-6"
    >
      {notifications.map((item) => (
        <NotificationToast
          key={item.id}
          item={item}
          onDismiss={onDismiss}
          accent={accent}
        />
      ))}
    </div>
  );
}
