import Link from 'next/link';
import { StatusBadge } from './status-badge';

export type AppointmentListItem = {
  id: string; referenceNumber: string; startsAt: Date | string; status: string;
  patientName?: string | null; practitionerName?: string | null; departmentName?: string | null;
};

export function AppointmentList({ appointments }: { appointments: AppointmentListItem[] }) {
  if (!appointments.length) return <p className="border border-border bg-surface p-6 text-muted">No appointments match the current view.</p>;
  return <div className="overflow-x-auto border border-border bg-surface">
    <table className="w-full min-w-[760px] text-left">
      <thead><tr className="border-b border-border"><th className="p-4">Date and time</th><th>Patient</th><th>Department</th><th>Practitioner</th><th>Status</th><th><span className="sr-only">View</span></th></tr></thead>
      <tbody>{appointments.map(item => <tr className="border-b border-border last:border-0" key={item.id}>
        <td className="p-4"><span className="block font-medium">{new Date(item.startsAt).toLocaleString('en-GB')}</span><span className="text-muted">{item.referenceNumber}</span></td>
        <td>{item.patientName ?? 'Patient'}</td><td>{item.departmentName ?? '—'}</td><td>{item.practitionerName ?? '—'}</td>
        <td><StatusBadge status={item.status} /></td><td className="pr-4 text-right"><Link className="text-accent hover:underline" href={`/admin/appointments/${item.id}`}>View</Link></td>
      </tr>)}</tbody>
    </table>
  </div>;
}
