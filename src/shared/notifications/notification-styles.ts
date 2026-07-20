import {
  faCheck,
  faCircleInfo,
  faTriangleExclamation,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import type { NotificationType } from './notification.types';

export const notificationTypeStyles: Record<
  NotificationType,
  {
    icon: typeof faCheck;
    ring: string;
    iconBg: string;
    iconColor: string;
    progress: string;
  }
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
