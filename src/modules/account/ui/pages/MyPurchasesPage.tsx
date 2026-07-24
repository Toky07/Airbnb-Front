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
    <div className="bg-gradient-to-b from-slate-50 via-white to-white">
      <PageContainer className="py-12 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand">Mon compte</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Mes achats
            </h1>
            <p className="mt-3 text-base text-slate-600">
              Retrouvez l’historique de vos séjours confirmés et annulés, avec le détail de chaque
              réservation.
            </p>
          </div>

          {loading ? (
            <div className="mt-10 space-y-5">
              <div className="h-44 animate-pulse rounded-3xl bg-slate-100" />
              <div className="h-44 animate-pulse rounded-3xl bg-slate-100" />
            </div>
          ) : null}

          {error ? (
            <p className="mt-10 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {!loading && !error && reservations.length === 0 ? (
            <div className="mt-12 rounded-3xl border border-dashed border-slate-200 bg-white/80 p-12 text-center shadow-sm">
              <p className="text-lg font-medium text-slate-700">
                Vous n’avez pas encore de réservation payée
              </p>
              <p className="mt-2 text-sm text-slate-500">
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
