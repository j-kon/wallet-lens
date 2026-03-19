import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import { MOTION_EASE } from '../../utils/motion';

function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  action,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.42, ease: MOTION_EASE }}
      className={`relative flex flex-col items-center justify-center overflow-hidden rounded-[30px] border border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-6 py-12 text-center ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(142,178,198,0.08),transparent_45%)] opacity-70" />
      <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] border border-white/10 bg-white/[0.05] shadow-[0_12px_36px_rgba(3,7,18,0.3)]">
        <div className="absolute inset-0 rounded-[22px] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_60%)]" />
        <Icon className="relative h-6 w-6 text-slate-200" />
      </div>
      <h3 className="relative font-display text-[1.35rem] tracking-tight text-slate-100">{title}</h3>
      <p className="relative mt-3 max-w-md text-sm leading-7 text-slate-400">{description}</p>
      {action ? <div className="relative mt-7">{action}</div> : null}
    </motion.div>
  );
}

export default EmptyState;
