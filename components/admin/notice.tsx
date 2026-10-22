export function Notice({ children, tone = 'info' }: { children: React.ReactNode; tone?: 'info' | 'success' | 'error' }) {
  const colour = tone === 'error' ? 'border-red-700 bg-red-50 text-red-900' : tone === 'success' ? 'border-green-700 bg-green-50 text-green-900' : 'border-accent bg-accent-soft text-ink';
  return <div role={tone === 'error' ? 'alert' : 'status'} className={`border-l-2 px-4 py-3 ${colour}`}>{children}</div>;
}
