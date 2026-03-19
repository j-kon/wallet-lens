import { motion } from 'framer-motion';
import { ArrowRight, Search, TestTubeDiagonal, Trash2 } from 'lucide-react';
import Card from './UI/Card';
import { fadeUp, MOTION_EASE } from '../utils/motion';

function AddressSearch({
  value,
  onChange,
  onSubmit,
  onUseDemo,
  onClear,
  isLoading,
  validationError,
  sectionLabel = 'Explorer Search',
  title = 'Inspect a testnet address or transaction',
  description = 'Paste a Bech32 testnet address or a 64-character transaction id to inspect live Esplora data.',
  submitLabel = 'Inspect query',
  helperText = 'WalletLens accepts Bech32 testnet addresses starting with tb1 and 64-character transaction ids.',
}) {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
      <Card className="overflow-hidden p-6 lg:p-7">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{sectionLabel}</p>
          <h2 className="mt-2 font-display text-[2rem] tracking-[-0.04em] text-slate-50">{title}</h2>
          <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400">{description}</p>
        </div>
        <motion.div
          className="hidden rounded-[22px] border border-white/10 bg-white/[0.05] p-3 text-brand-sky shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:block"
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Search className="h-5 w-5" />
        </motion.div>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-3 block text-sm font-medium text-slate-200">Testnet address or transaction id</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="tb1q... or 64-char txid"
              className="h-14 w-full rounded-[22px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,12,18,0.96),rgba(11,16,24,0.92))] pl-12 pr-4 text-sm text-slate-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] outline-none placeholder:text-slate-500/90 focus:border-brand-sky/35 focus:bg-[#0d131c] focus:ring-2 focus:ring-brand-sky/12 focus:shadow-[0_0_0_1px_rgba(142,178,198,0.16),0_0_24px_rgba(142,178,198,0.08)] disabled:opacity-60"
            />
            {isLoading ? (
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-[22px] border border-brand-sky/10"
                animate={{ opacity: [0.25, 0.7, 0.25] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              />
            ) : null}
          </div>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <motion.button
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.985 }}
            type="submit"
            disabled={isLoading}
            transition={{ duration: 0.2, ease: MOTION_EASE }}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-[20px] border border-brand-amber/22 bg-[linear-gradient(180deg,rgba(216,164,91,0.16),rgba(216,164,91,0.08))] px-4 text-sm font-medium text-brand-amber shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_24px_rgba(216,164,91,0.08)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Querying testnet...' : submitLabel}
            <ArrowRight className="h-4 w-4" />
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
            type="button"
            onClick={onUseDemo}
            disabled={isLoading}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <TestTubeDiagonal className="h-4 w-4 text-brand-sky" />
            Try demo address
          </motion.button>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.985 }}
            type="button"
            onClick={onClear}
            disabled={isLoading && !value}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-transparent px-4 text-sm font-medium text-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </motion.button>
        </div>
      </form>

      <div className="mt-4 min-h-6 text-sm">
        {validationError ? (
          <p className="text-rose-300">{validationError}</p>
        ) : (
          <p className="text-slate-400">{helperText}</p>
        )}
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Data Surfaces</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">Address balance, mempool activity, UTXOs, transaction pages, and tx drilldowns.</p>
        </div>
        <div className="rounded-[22px] border border-white/10 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Resilience</p>
          <p className="mt-2 text-sm leading-6 text-slate-200">Universal search routes queries intelligently while keeping empty, invalid, and network states explicit.</p>
        </div>
      </div>
    </Card>
    </motion.div>
  );
}

export default AddressSearch;
