const labels: Record<string, string> = { REQUESTED: 'Requested', CONFIRMED: 'Confirmed', ARRIVED: 'Arrived', IN_CONSULTATION: 'In consultation', COMPLETED: 'Completed', CANCELLED: 'Cancelled', NO_SHOW: 'No show' };
export function StatusBadge({ status }: { status: string }) {
  return <span className="inline-flex border border-border bg-canvas px-2.5 py-1 font-medium">{labels[status] ?? status}</span>;
}
