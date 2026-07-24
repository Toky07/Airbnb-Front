export function isStayEnded(endDate: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return endDate < today;
}

export function canLeaveReview(
  status: string,
  endDate: string,
  hasExistingReview: boolean,
): boolean {
  return status === 'confirmed' && isStayEnded(endDate) && !hasExistingReview;
}
