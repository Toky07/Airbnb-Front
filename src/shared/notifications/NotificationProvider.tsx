import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_NOTIFICATION_DURATION,
  type NotificationItem,
  type NotificationType,
  type NotifyOptions,
} from './notification.types';
import { NotificationContext, type NotificationContextValue } from './notification.context';
import NotificationContainer from './NotificationContainer';

let notificationCounter = 0;

function createNotificationId(): string {
  notificationCounter += 1;
  return `notification-${Date.now()}-${notificationCounter}`;
}

type NotificationProviderProps = {
  children: ReactNode;
  accent?: 'rose' | 'brand';
};

export function NotificationProvider({
  children,
  accent = 'brand',
}: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setNotifications((current) => current.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (message: string, options?: NotifyOptions) => {
      const id = createNotificationId();
      const item: NotificationItem = {
        id,
        message,
        type: options?.type ?? 'info',
        duration: options?.duration ?? DEFAULT_NOTIFICATION_DURATION,
      };

      setNotifications((current) => [...current, item].slice(-5));
      return id;
    },
    [],
  );

  const notifyWithType = useCallback(
    (type: NotificationType) =>
      (message: string, options?: Omit<NotifyOptions, 'type'>) =>
        notify(message, { ...options, type }),
    [notify],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      notify,
      success: notifyWithType('success'),
      error: notifyWithType('error'),
      info: notifyWithType('info'),
      warning: notifyWithType('warning'),
      dismiss,
    }),
    [notify, notifyWithType, dismiss],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer
        notifications={notifications}
        onDismiss={dismiss}
        accent={accent}
      />
    </NotificationContext.Provider>
  );
}
