import {
  formatCentsPrice,
  type PricingBreakdown,
} from '../../pricing/pricing-breakdown.types';

type PricingBreakdownSummaryProps = {
  breakdown: PricingBreakdown;
  totalClassName?: string;
};

const PricingBreakdownSummary = ({
  breakdown,
  totalClassName = 'text-2xl font-bold text-ink',
}: PricingBreakdownSummaryProps) => (
  <div className="space-y-2 text-sm">
    <div className="flex items-center justify-between text-ink/70">
      <span>Sous-total hébergement</span>
      <span>{formatCentsPrice(breakdown.subtotalCents)}</span>
    </div>
    {breakdown.vatCents > 0 ? (
      <div className="flex items-center justify-between text-ink/70">
        <span>TVA</span>
        <span>{formatCentsPrice(breakdown.vatCents)}</span>
      </div>
    ) : null}
    {breakdown.touristTaxCents > 0 ? (
      <div className="flex items-center justify-between text-ink/70">
        <span>Taxe de séjour</span>
        <span>{formatCentsPrice(breakdown.touristTaxCents)}</span>
      </div>
    ) : null}
    {breakdown.serviceFeeCents > 0 ? (
      <div className="flex items-center justify-between text-ink/70">
        <span>Frais de service</span>
        <span>{formatCentsPrice(breakdown.serviceFeeCents)}</span>
      </div>
    ) : null}
    <div className="flex items-center justify-between border-t border-line pt-3">
      <span className="font-medium text-ink/70">Total TTC</span>
      <span className={totalClassName}>{formatCentsPrice(breakdown.totalCents)}</span>
    </div>
  </div>
);

export default PricingBreakdownSummary;
