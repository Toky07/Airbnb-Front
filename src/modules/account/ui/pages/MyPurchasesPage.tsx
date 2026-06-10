import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getReservationService } from '../../../reservation/core/services/reservation.service';
import {
  type Reservation,
} from '../../../reservation/core/types/reservation.types';
import { getButtonClassName } from '../../../../shared/ui/button/button-classes';
import { PageContainer } from '../../../../shared/ui';
import PurchaseCard from '../components/PurchaseCard';

const MyPurchasesPage = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getReservationService()
      .listMine()
      .then((result) => {
        if (!result.success) {
          setError(result.error);
          return;
        }

        setReservations(
          result.reservations.filter((reservation) => reservation.status !== 'pending'),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
      <PageContainer className="py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold text-slate-900">Mes achats</h1>
          <p className="mt-2 text-sm text-slate-500">
            Retrouvez l’historique de vos réservations confirmées et annulées.
          </p>

          {loading ? (
            <div className="mt-10 h-40 animate-pulse rounded-3xl bg-slate-100" />
          ) : null}

          {error ? (
            <p className="mt-10 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {!loading && !error && reservations.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <p className="text-slate-600">Vous n’avez pas encore de réservation payée.</p>
              <Link
                to="/search"
                className={getButtonClassName('primary', 'md', 'mt-6 inline-flex')}
              >
                Rechercher une chambre
              </Link>
            </div>
          ) : null}

          {!loading && !error && reservations.length > 0 ? (
            <div className="mt-10 space-y-4">
              {reservations.map((reservation) => (
                <PurchaseCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          ) : null}
        </div>
      </PageContainer>
  );
};

export default MyPurchasesPage;
