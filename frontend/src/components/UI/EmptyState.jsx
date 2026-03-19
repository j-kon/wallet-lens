import { SearchX } from 'lucide-react';

function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.02] px-6 py-12 text-center ${className}`}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
        <Icon className="h-6 w-6 text-slate-300" />
      </div>
      <h3 className="font-display text-xl text-slate-100">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
