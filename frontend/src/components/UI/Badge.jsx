import { cn } from '../../utils/cn';

const variants = {
  neutral: 'border-white/10 bg-white/5 text-slate-200',
  subtle: 'border-white/8 bg-white/[0.03] text-slate-300',
  success: 'border-emerald-400/20 bg-emerald-400/10 text-emerald-200',
  warning: 'border-amber-400/20 bg-amber-400/10 text-amber-200',
  danger: 'border-rose-400/20 bg-rose-400/10 text-rose-200',
  accent: 'border-brand-sky/20 bg-brand-sky/10 text-brand-sky',
  testnet: 'border-brand-amber/20 bg-brand-amber/10 text-brand-amber',
};

function Badge({ children, variant = 'neutral', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em]',
        variants[variant] ?? variants.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
