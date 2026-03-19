import { cn } from '../../utils/cn';

export function Loader({ label = 'Loading wallet activity...', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-12 text-center', className)}>
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand-amber border-r-brand-sky" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-slate-100">{label}</p>
        <p className="text-xs text-slate-400">Syncing address, transaction, and UTXO data.</p>
      </div>
    </div>
  );
}

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl border border-white/[0.04] bg-white/[0.04]',
        className,
      )}
    />
  );
}
