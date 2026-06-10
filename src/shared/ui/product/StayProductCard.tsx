import { faCalendarDays, faLocationDot, faMoon, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { resolveMediaUrl } from '../../utils/resolve-media-url';
import { formatBookingDateRange } from '../../utils/format-booking-date';

export type StayProductDetails = {
  roomName: string;
  propertyName: string;
  propertyCity?: string | null;
  imageUrl?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  guestCount?: number | null;
  nights?: number | null;
  totalPrice: number;
  priceLabel: string;
  roomId?: number | null;
};

type StayProductCardProps = {
  details: StayProductDetails;
  badge?: string;
  statusLabel?: string;
  statusTone?: 'success' | 'neutral' | 'danger';
  action?: ReactNode;
  footerLink?: {
    to: string;
    label: string;
  };
};

const statusToneClasses = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
  danger: 'bg-red-50 text-red-700 ring-red-100',
};

export function StayProductCard({
  details,
  badge,
  statusLabel,
  statusTone = 'neutral',
  action,
  footerLink,
}: StayProductCardProps) {
  const imageSrc = resolveMediaUrl(details.imageUrl);

  return (
    <article className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        <div className="relative aspect-[4/3] w-full shrink-0 bg-slate-100 sm:aspect-auto sm:w-64 sm:min-h-[200px]">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={details.roomName}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-slate-400">
              Aucune photo
            </div>
          )}
          {badge ? (
            <span className="absolute left-4 top-4 rounded-sm bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-slate-800 shadow-sm">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold tracking-widest uppercase text-brand">{details.propertyName}</p>
              <h3 className="mt-2 font-serif text-2xl font-medium text-slate-900">{details.roomName}</h3>
              {details.propertyCity ? (
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <FontAwesomeIcon icon={faLocationDot} className="h-3.5 w-3.5 text-brand/60" />
                  {details.propertyCity}
                </p>
              ) : null}
            </div>

            <div className="text-right">
              {statusLabel ? (
                <span
                  className={`inline-flex rounded-sm px-3 py-1.5 text-xs font-semibold tracking-wider uppercase ring-1 ring-inset ${statusToneClasses[statusTone]}`}
                >
                  {statusLabel}
                </span>
              ) : null}
              <p className="mt-4 text-2xl font-medium text-slate-900">{details.priceLabel}</p>
            </div>
          </div>

          {details.startDate && details.endDate ? (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-600">
              <span className="inline-flex items-center gap-2.5">
                <FontAwesomeIcon icon={faCalendarDays} className="h-4 w-4 text-slate-400" />
                {formatBookingDateRange(details.startDate, details.endDate)}
              </span>
              {details.guestCount ? (
                <span className="inline-flex items-center gap-2.5">
                  <FontAwesomeIcon icon={faUsers} className="h-4 w-4 text-slate-400" />
                  {details.guestCount} voyageur{details.guestCount > 1 ? 's' : ''}
                </span>
              ) : null}
              {details.nights ? (
                <span className="inline-flex items-center gap-2.5">
                  <FontAwesomeIcon icon={faMoon} className="h-4 w-4 text-slate-400" />
                  {details.nights} nuit{details.nights > 1 ? 's' : ''}
                </span>
              ) : null}
            </div>
          ) : null}

          {action || footerLink ? (
            <div className="mt-auto flex items-center justify-between gap-4 pt-6">
              {footerLink ? (
                <Link
                  to={footerLink.to}
                  className="text-sm font-semibold tracking-wide text-brand hover:text-brand-dark"
                >
                  {footerLink.label}
                </Link>
              ) : (
                <span />
              )}
              {action}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function parseProductLabel(label: string): {
  roomName: string;
  propertyName: string;
} {
  const parts = label.split('·').map((part) => part.trim());
  if (parts.length >= 2) {
    return {
      roomName: parts[0]!,
      propertyName: parts.slice(1).join(' · '),
    };
  }

  return {
    roomName: label,
    propertyName: 'Établissement',
  };
}
