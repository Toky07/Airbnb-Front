export const CANCELLATION_POLICY = {
  FLEXIBLE: 'flexible',
  MODERATE: 'moderate',
  STRICT: 'strict',
} as const;

export type CancellationPolicy =
  (typeof CANCELLATION_POLICY)[keyof typeof CANCELLATION_POLICY];

export const CANCELLATION_POLICY_LABELS: Record<CancellationPolicy, string> = {
  flexible: 'Annulation flexible',
  moderate: 'Annulation modérée',
  strict: 'Annulation stricte',
};

export function getCancellationPolicyLabel(
  policy: string | null | undefined,
): string | null {
  if (policy === CANCELLATION_POLICY.FLEXIBLE) {
    return CANCELLATION_POLICY_LABELS.flexible;
  }
  if (policy === CANCELLATION_POLICY.MODERATE) {
    return CANCELLATION_POLICY_LABELS.moderate;
  }
  if (policy === CANCELLATION_POLICY.STRICT) {
    return CANCELLATION_POLICY_LABELS.strict;
  }
  return null;
}

export const CANCELLATION_POLICY_OPTIONS = [
  { value: CANCELLATION_POLICY.FLEXIBLE, label: CANCELLATION_POLICY_LABELS.flexible },
  { value: CANCELLATION_POLICY.MODERATE, label: CANCELLATION_POLICY_LABELS.moderate },
  { value: CANCELLATION_POLICY.STRICT, label: CANCELLATION_POLICY_LABELS.strict },
] as const;
