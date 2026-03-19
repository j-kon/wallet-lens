import { motion } from 'framer-motion';
import { Blocks } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from './UI/Badge';
import Card from './UI/Card';
import { Skeleton } from './UI/Loader';
import { formatTimestampWithRelative } from '../utils/formatDate';
import { getBlockRoute } from '../utils/explorerLinks';
import { formatBytes, formatNumber } from '../utils/formatNumber';
import { fadeUp, hoverLift, listItemReveal, softStagger } from '../utils/motion';

function LatestBlocksPanel({ blocks, loading, error }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
      <Card className="p-5 lg:p-6">
        <div className="flex flex-col gap-3 border-b border-white/6 pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Latest Blocks</p>
            <h2 className="mt-2 font-display text-[1.7rem] tracking-[-0.04em] text-slate-50">
              Recent chain tips
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Follow the newest testnet blocks with compact height, timing, and transaction context.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">{blocks.length || 5} slots</Badge>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-brand-sky">
              <Blocks className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-1">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-3.5">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
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
            className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-1"
          >
            {blocks.slice(0, 5).map((block) => (
              <motion.div
                key={block.id}
                variants={listItemReveal}
                whileHover={hoverLift}
                className="h-full rounded-[22px] border border-white/8 bg-white/[0.03] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:border-white/12 hover:bg-white/[0.05]"
              >
                <div className="flex h-full flex-col gap-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <Badge variant="subtle">Height {formatNumber(block.height)}</Badge>
                      <p className="text-xs text-slate-400">
                        {formatTimestampWithRelative(block.timestamp)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="accent">{formatNumber(block.txCount)} txs</Badge>
                      <Link
                        to={getBlockRoute(block.id)}
                        className="inline-flex h-8 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/25"
                      >
                        Open block
                      </Link>
                    </div>
                  </div>
                  <div className="grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Transactions</p>
                      <p className="mt-1 text-slate-200">{formatNumber(block.txCount)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Block Size</p>
                      <p className="mt-1 text-slate-200">{formatBytes(block.size)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}

export default LatestBlocksPanel;
