export type PaymentStatusKey = 'pending' | 'processing' | 'confirmed' | 'failed' | 'canceled';

export const paymentStatusConfig: Record<
  PaymentStatusKey,
  { label: string; className: string }
> = {
  pending: { label: 'En attente', className: 'bg-amber-50 text-amber-700 ring-amber-600/20' },
  processing: { label: 'En cours', className: 'bg-blue-50 text-blue-700 ring-blue-600/20' },
  confirmed: { label: 'Payée', className: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' },
  failed: { label: 'Échouée', className: 'bg-red-50 text-red-700 ring-red-600/20' },
  canceled: { label: 'Annulée', className: 'bg-slate-50 text-slate-600 ring-slate-500/20' },
};
