import { Link } from 'react-router';
import { getButtonClassName } from '../../../../shared/ui/button/button-classes';
import { PageContainer } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import PurchaseCard from '../components/PurchaseCard';
import { useMyPurchases } from '../hooks/useMyPurchases';
import { useMyReviewReservationIds } from '../../../review/ui/hooks/useMyReviewReservationIds';

const MyPurchasesPage = () => {
  usePageTitle('Mes achats');
  const { reservations, loading, error, refresh, invoiceByPaymentId, downloadingId, downloadInvoice } =
    useMyPurchases();
  const { reservationIds: reviewedReservationIds, markReviewed } =
    useMyReviewReservationIds();

  return (
    <div className="page-mist">
      <PageContainer className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Mon compte</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Mes achats
            </h1>
            <p className="mt-3 text-base text-ink/60">
              Retrouvez l’historique de vos séjours confirmés et annulés, avec le détail de chaque
              réservation.
            </p>
          </div>

          {loading ? (
            <div className="mt-10 space-y-5">
              <div className="h-44 animate-pulse rounded-2xl bg-mist" />
              <div className="h-44 animate-pulse rounded-2xl bg-mist" />
            </div>
          ) : null}

          {error ? (
            <p className="mt-10 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {!loading && !error && reservations.length === 0 ? (
            <div className="mt-12 rounded-2xl border border-dashed border-line bg-surface/80 p-12 text-center soft-shadow">
              <p className="text-lg font-medium text-ink/70">
                Vous n’avez pas encore de réservation payée
              </p>
              <p className="mt-2 text-sm text-ink/50">
                Dès votre premier paiement, vos séjours apparaîtront ici.
              </p>
              <Link
                to="/search"
                className={getButtonClassName('primary', 'md', 'mt-8 inline-flex')}
              >
                Rechercher une chambre
              </Link>
            </div>
          ) : null}

          {!loading && !error && reservations.length > 0 ? (
            <div className="mt-10 space-y-5">
              {reservations.map((reservation) => (
                <PurchaseCard
                  key={reservation.id}
                  reservation={reservation}
                  invoice={
                    reservation.paymentId
                      ? invoiceByPaymentId.get(reservation.paymentId) ?? null
                      : null
                  }
                  downloadingInvoice={
                    reservation.paymentId
                      ? downloadingId === invoiceByPaymentId.get(reservation.paymentId)?.id
                      : false
                  }
                  onDownloadInvoice={(invoiceId) => void downloadInvoice(invoiceId)}
                  onCancelled={() => void refresh()}
                  hasReview={reviewedReservationIds.has(reservation.id)}
                  onReviewSubmitted={() => markReviewed(reservation.id)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </PageContainer>
    </div>
  );
};

export default MyPurchasesPage;
