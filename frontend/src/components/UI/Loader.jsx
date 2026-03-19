import { cn } from '../../utils/cn';

export function Loader({ label = 'Loading wallet activity...', className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-12 text-center', className)}>
      <div className="relative h-12 w-12">
        <div className="absolute inset-[-6px] rounded-full border border-brand-sky/10 opacity-70 [animation:pulseHalo_2.6s_ease-out_infinite]" />
        <div className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.02]" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand-amber border-r-brand-sky shadow-[0_0_18px_rgba(142,178,198,0.18)]" />
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
        'relative overflow-hidden rounded-2xl border border-white/[0.04] bg-white/[0.04] before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.8s_infinite] before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]',
        className,
      )}
    />
  );
}

export function InlineSpinner({ className }) {
  return (
    <span
      className={cn(
        'inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-brand-sky shadow-[0_0_12px_rgba(142,178,198,0.18)]',
        className,
      )}
      aria-hidden="true"
    />
  );
}
