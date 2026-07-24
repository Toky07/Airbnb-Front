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
  success: 'bg-brand/10 text-brand ring-brand/20',
  neutral: 'bg-mist text-ink/70 ring-line',
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
    <article className="overflow-hidden rounded-2xl bg-surface transition duration-200 hover:-translate-y-0.5 soft-shadow">
      <div className="flex flex-col sm:flex-row">
        <div className="relative aspect-[4/3] w-full shrink-0 bg-mist sm:aspect-auto sm:w-64 sm:min-h-[200px]">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={details.roomName}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full min-h-[200px] items-center justify-center text-sm text-ink/40">
              Aucune photo
            </div>
          )}
          {badge ? (
            <span className="absolute left-4 top-4 rounded-xl bg-white/95 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ink">
              {badge}
            </span>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold tracking-widest uppercase text-brand">{details.propertyName}</p>
              <h3 className="font-display mt-2 text-2xl font-medium text-ink">{details.roomName}</h3>
              {details.propertyCity ? (
                <p className="mt-2 flex items-center gap-2 text-sm text-ink/60">
                  <FontAwesomeIcon icon="location-dot" className="h-3.5 w-3.5 text-brand/60" />
                  {details.propertyCity}
                </p>
              ) : null}
            </div>

            <div className="text-right">
              {statusLabel ? (
                <span
                  className={`inline-flex rounded-xl px-3 py-1.5 text-xs font-semibold tracking-wider uppercase ring-1 ring-inset ${statusToneClasses[statusTone]}`}
                >
                  {statusLabel}
                </span>
              ) : null}
              <p className="mt-4 text-2xl font-medium text-ink">{details.priceLabel}</p>
            </div>
          </div>

          {details.startDate && details.endDate ? (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-ink/70">
              <span className="inline-flex items-center gap-2.5">
                <FontAwesomeIcon icon="calendar-days" className="h-4 w-4 text-ink/40" />
                {formatBookingDateRange(details.startDate, details.endDate)}
              </span>
              {details.guestCount ? (
                <span className="inline-flex items-center gap-2.5">
                  <FontAwesomeIcon icon="users" className="h-4 w-4 text-ink/40" />
                  {details.guestCount} voyageur{details.guestCount > 1 ? 's' : ''}
                </span>
              ) : null}
              {details.nights ? (
                <span className="inline-flex items-center gap-2.5">
                  <FontAwesomeIcon icon="moon" className="h-4 w-4 text-ink/40" />
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
                  className="text-sm font-semibold tracking-wide text-brand transition duration-200 hover:text-brand-dark"
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
