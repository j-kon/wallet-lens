import { motion } from 'framer-motion';
import { RadioTower } from 'lucide-react';
import Badge from './UI/Badge';
import Card from './UI/Card';
import { Skeleton } from './UI/Loader';
import { formatSats } from '../utils/formatBTC';
import { formatNumber, formatVBytes } from '../utils/formatNumber';
import { fadeUp, listItemReveal, softStagger } from '../utils/motion';

function Metric({ label, value, helper }) {
  return (
    <motion.div
      variants={listItemReveal}
      className="rounded-[22px] border border-white/8 bg-white/[0.03] px-3.5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{label}</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{helper}</p>
        </div>
        <p className="shrink-0 text-right font-display text-[1.55rem] tracking-[-0.04em] text-slate-50">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function HistogramBar({ feeRate, vsize, maxVsize }) {
  const width = maxVsize > 0 ? Math.max((vsize / maxVsize) * 100, 6) : 6;

  return (
    <motion.div variants={listItemReveal} className="space-y-2">
      <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
        <span>{feeRate >= 0 ? `${feeRate}+ sat/vB` : 'Unknown band'}</span>
        <span>{formatVBytes(vsize)}</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.05]">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(142,178,198,0.92),rgba(216,164,91,0.88))]"
          style={{ width: `${width}%` }}
        />
      </div>
    </motion.div>
  );
}

function MempoolOverviewPanel({ mempool, loading, error }) {
  const histogram = mempool?.feeHistogram ?? [];
  const maxHistogramVsize = histogram.reduce((max, [, vsize]) => Math.max(max, vsize), 0);

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
      <Card className="p-5 lg:p-6">
        <div className="flex flex-col gap-3 border-b border-white/6 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Mempool Overview</p>
            <h2 className="mt-2 font-display text-[1.7rem] tracking-[-0.04em] text-slate-50">
              Network pressure
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Track queued transaction volume, virtual size, and aggregate fees waiting to confirm.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="warning">Live mempool</Badge>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-brand-amber">
              <RadioTower className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 space-y-2.5">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-3.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="mt-3 h-9 w-24" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-5 rounded-[22px] border border-amber-400/15 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
            {error}
          </div>
        ) : (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={softStagger}
              className="mt-4 space-y-2.5"
            >
              <Metric
                label="Transactions"
                value={formatNumber(mempool?.count)}
                helper="Current queue depth"
              />
              <Metric
                label="Virtual Size"
                value={formatVBytes(mempool?.vsize)}
                helper="Aggregate vbytes waiting to clear"
              />
              <Metric
                label="Total Fees"
                value={formatSats(mempool?.totalFee)}
                helper="Sum of fees in the mempool snapshot"
              />
            </motion.div>

            {histogram.length > 0 ? (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={softStagger}
                className="mt-4 rounded-[22px] border border-white/8 bg-white/[0.03] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Fee Histogram</p>
                  <Badge variant="subtle">Priority bands</Badge>
                </div>
                <div className="mt-3 space-y-2.5">
                  {histogram.slice(0, 5).map(([feeRate, vsize]) => (
                    <HistogramBar
                      key={`${feeRate}-${vsize}`}
                      feeRate={feeRate}
                      vsize={vsize}
                      maxVsize={maxHistogramVsize}
                    />
                  ))}
                </div>
              </motion.div>
            ) : null}
          </>
        )}
      </Card>
    </motion.div>
  );
}

export default MempoolOverviewPanel;
