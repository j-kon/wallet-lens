import { cn } from '../../utils/cn';

const variants = {
  neutral: 'border-white/10 bg-white/[0.045] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
  subtle: 'border-white/8 bg-white/[0.03] text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
  success: 'border-emerald-400/18 bg-emerald-400/[0.11] text-emerald-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
  warning: 'border-amber-400/18 bg-amber-400/[0.11] text-amber-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
  danger: 'border-rose-400/18 bg-rose-400/[0.11] text-rose-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
  accent: 'border-brand-sky/18 bg-brand-sky/[0.1] text-brand-sky shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
  testnet: 'border-brand-amber/18 bg-brand-amber/[0.11] text-brand-amber shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
};

function Badge({ children, variant = 'neutral', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] backdrop-blur-md',
        variants[variant] ?? variants.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
