import type { ReservationArrivalGuide } from '../../../reservation/core/types/reservation.types';

function GuideRow({ label, value }: { label: string; value: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-ink/40">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm text-ink/80">{value}</dd>
    </div>
  );
}

type PurchaseArrivalGuideProps = {
  guide: ReservationArrivalGuide;
};

export default function PurchaseArrivalGuide({ guide }: PurchaseArrivalGuideProps) {
  return (
    <details className="rounded-2xl border border-line bg-surface p-5">
      <summary className="cursor-pointer font-medium text-ink">
        Instructions d’arrivée
      </summary>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        <GuideRow label="Adresse" value={guide.address} />
        <GuideRow label="Arrivée" value={guide.checkInTime} />
        <GuideRow label="Départ" value={guide.checkOutTime} />
        <GuideRow label="Wifi" value={guide.wifiName} />
        <GuideRow label="Mot de passe wifi" value={guide.wifiPassword} />
        <GuideRow label="Contact d’urgence" value={guide.emergencyContact} />
        <div className="sm:col-span-2">
          <GuideRow label="Règlement intérieur" value={guide.houseRules} />
        </div>
        <div className="sm:col-span-2">
          <GuideRow label="Comment entrer" value={guide.checkInInstructions} />
        </div>
      </dl>
    </details>
  );
}
