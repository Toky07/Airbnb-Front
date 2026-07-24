export type PaymentStatusKey =
  | 'pending'
  | 'processing'
  | 'confirmed'
  | 'succeeded'
  | 'failed'
  | 'canceled'
  | 'no_show';

export const paymentStatusConfig: Record<
  PaymentStatusKey,
  { label: string; className: string }
> = {
  pending: { label: 'En attente', className: 'bg-amber-500/10 text-amber-700 ring-amber-500/15' },
  processing: { label: 'En cours', className: 'bg-sky-500/10 text-sky-700 ring-sky-500/15' },
  confirmed: { label: 'Payée', className: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/15' },
  succeeded: { label: 'Payée', className: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/15' },
  failed: { label: 'Échouée', className: 'bg-red-500/10 text-red-700 ring-red-500/15' },
  canceled: { label: 'Annulée', className: 'bg-mist text-ink/60 ring-ink/10' },
  no_show: { label: 'No-show', className: 'bg-orange-500/10 text-orange-700 ring-orange-500/15' },
};
