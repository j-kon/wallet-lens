import { motion } from 'framer-motion';
import { Gauge, TimerReset } from 'lucide-react';
import Badge from './UI/Badge';
import Card from './UI/Card';
import { Skeleton } from './UI/Loader';
import { formatFeeRate } from '../utils/formatBTC';
import { fadeUp, listItemReveal, softStagger } from '../utils/motion';

function FeeBandCard({ label, target, helper, tone }) {
  return (
    <motion.div
      variants={listItemReveal}
      className="rounded-[22px] border border-white/8 bg-white/[0.03] px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{label}</p>
            <div
              className={`rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] ${tone}`}
            >
              {helper}
            </div>
          </div>
        </div>
        <p className="shrink-0 text-right font-display text-[1.55rem] tracking-[-0.04em] text-slate-50">
          {formatFeeRate(target)}
        </p>
      </div>
    </motion.div>
  );
}

function FeeEstimatesPanel({ feeBands, loading, error }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
      <Card className="p-5 lg:p-6">
        <div className="flex flex-col gap-3 border-b border-white/6 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Fee Estimates</p>
            <h2 className="mt-2 font-display text-[1.7rem] tracking-[-0.04em] text-slate-50">
              Confirmation pricing
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Live feerate guidance from Esplora to benchmark wallet sends and transaction urgency.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">sat/vB</Badge>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-brand-sky">
              <Gauge className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 space-y-2.5">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="rounded-[22px] border border-white/8 bg-white/[0.03] px-3.5 py-3">
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-5 rounded-[22px] border border-amber-400/15 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            {error}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={softStagger}
            className="mt-4 space-y-2.5"
          >
            <FeeBandCard label="Fast" target={feeBands?.fast} helper="1 block" tone="text-emerald-300" />
            <FeeBandCard label="Medium" target={feeBands?.medium} helper="3-6 blocks" tone="text-brand-sky" />
            <FeeBandCard label="Slow" target={feeBands?.slow} helper="10+ blocks" tone="text-brand-amber" />
          </motion.div>
        )}

        <div className="mt-3.5 rounded-[20px] border border-white/8 bg-black/10 px-3.5 py-3 text-sm text-slate-400">
          <div className="flex items-start gap-2">
            <TimerReset className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
            <p>These estimates are useful as a benchmark, not a guarantee of confirmation timing.</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default FeeEstimatesPanel;
