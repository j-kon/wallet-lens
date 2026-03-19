import { motion } from 'framer-motion';
import { ArrowRight, Search, TestTubeDiagonal } from 'lucide-react';
import Card from './UI/Card';

function AddressSearch({
  value,
  onChange,
  onSubmit,
  onUseSample,
  isLoading,
  validationError,
}) {
  return (
    <Card className="overflow-hidden p-6 lg:p-7">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Address Search</p>
          <h2 className="mt-2 font-display text-2xl text-slate-50">Inspect a testnet wallet</h2>
        </div>
        <div className="hidden rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-brand-sky sm:block">
          <Search className="h-5 w-5" />
        </div>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-200">Bitcoin testnet address</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={value}
              onChange={(event) => onChange(event.target.value)}
              placeholder="tb1q..."
              className="h-14 w-full rounded-2xl border border-white/10 bg-[#0a0f16] pl-12 pr-4 text-sm text-slate-50 outline-none transition focus:border-brand-sky/40 focus:bg-[#0d131c] focus:ring-2 focus:ring-brand-sky/10"
            />
          </div>
        </label>

        <div className="flex flex-col gap-3 sm:flex-row">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-brand-amber/20 bg-brand-amber/10 px-4 text-sm font-medium text-brand-amber transition hover:bg-brand-amber/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'Querying testnet...' : 'Inspect address'}
            <ArrowRight className="h-4 w-4" />
          </motion.button>

          <button
            type="button"
            onClick={onUseSample}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-4 text-sm font-medium text-slate-200 transition hover:bg-white/[0.06]"
          >
            <TestTubeDiagonal className="h-4 w-4 text-brand-sky" />
            Load sample
          </button>
        </div>
      </form>

      <div className="mt-4 min-h-6 text-sm">
        {validationError ? (
          <p className="text-rose-300">{validationError}</p>
        ) : (
          <p className="text-slate-400">
            Supports Bech32, P2SH, and legacy testnet address formats.
          </p>
        )}
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Data Surfaces</p>
          <p className="mt-2 text-sm text-slate-200">Address balance, transaction history, UTXOs, and tx drilldowns.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Resilience</p>
          <p className="mt-2 text-sm text-slate-200">Live Esplora fetches with a portfolio-safe sample dataset fallback.</p>
        </div>
      </div>
    </Card>
  );
}

export default AddressSearch;
