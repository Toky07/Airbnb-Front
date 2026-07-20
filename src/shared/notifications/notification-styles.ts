import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import type { NotificationType } from './notification.types';

export const notificationTypeStyles: Record<
  NotificationType,
  {
    icon: IconProp;
    ring: string;
    iconBg: string;
    iconColor: string;
    progress: string;
  }
> = {
  success: {
    icon: 'check',
    ring: 'ring-emerald-100',
    iconBg: 'bg-emerald-500',
    iconColor: 'text-white',
    progress: 'bg-emerald-500',
  },
  error: {
    icon: 'xmark',
    ring: 'ring-red-100',
    iconBg: 'bg-red-500',
    iconColor: 'text-white',
    progress: 'bg-red-500',
  },
  info: {
    icon: 'circle-info',
    ring: 'ring-sky-100',
    iconBg: 'bg-sky-500',
    iconColor: 'text-white',
    progress: 'bg-sky-500',
  },
  warning: {
    icon: 'triangle-exclamation',
    ring: 'ring-amber-100',
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    progress: 'bg-amber-500',
  },
};
