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
    ring: 'border-brand/20',
    iconBg: 'bg-brand',
    iconColor: 'text-white',
    progress: 'bg-brand',
  },
  error: {
    icon: 'xmark',
    ring: 'border-red-200',
    iconBg: 'bg-red-500',
    iconColor: 'text-white',
    progress: 'bg-red-500',
  },
  info: {
    icon: 'circle-info',
    ring: 'border-brand/20',
    iconBg: 'bg-brand/10',
    iconColor: 'text-brand',
    progress: 'bg-brand',
  },
  warning: {
    icon: 'triangle-exclamation',
    ring: 'border-amber-200',
    iconBg: 'bg-amber-500',
    iconColor: 'text-white',
    progress: 'bg-amber-500',
  },
};
