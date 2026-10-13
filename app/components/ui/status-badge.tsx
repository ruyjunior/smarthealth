import { cn } from '@/app/lib/utils';

/** Coloured pill used for service statuses across the app. */
export default function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone =
    status === 'Feito'
      ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
      : status === 'Vazia'
        ? 'bg-slate-100 text-slate-600 ring-slate-200'
        : 'bg-blue-50 text-blue-700 ring-blue-200';

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset',
        tone,
        className,
      )}
    >
      {status}
    </span>
  );
}
