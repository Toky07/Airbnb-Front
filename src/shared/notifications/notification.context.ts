import { createContext } from 'react';
import type {
  NotificationType,
  NotifyOptions,
} from './notification.types';

export type NotificationContextValue = {
  notify: (message: string, options?: NotifyOptions) => string;
  success: (message: string, options?: Omit<NotifyOptions, 'type'>) => string;
  error: (message: string, options?: Omit<NotifyOptions, 'type'>) => string;
  info: (message: string, options?: Omit<NotifyOptions, 'type'>) => string;
  warning: (message: string, options?: Omit<NotifyOptions, 'type'>) => string;
  dismiss: (id: string) => void;
};

export const NotificationContext = createContext<NotificationContextValue | null>(
  null,
);

export type { NotificationType, NotifyOptions };
