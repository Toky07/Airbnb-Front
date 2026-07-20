import type { NotificationItem } from './notification.types';
import NotificationToast from './NotificationToast';

type NotificationContainerProps = {
  notifications: NotificationItem[];
  onDismiss: (id: string) => void;
  accent?: 'rose' | 'brand';
};

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
        <NotificationToast key={item.id} item={item} onDismiss={onDismiss} accent={accent} />
      ))}
    </div>
  );
}
