export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export type NotificationItem = {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
};

export type NotifyOptions = {
  /** Durée en ms avant fermeture auto. Défaut : 5000. 0 = persistant. */
  duration?: number;
  type?: NotificationType;
};

export const DEFAULT_NOTIFICATION_DURATION = 5000;
