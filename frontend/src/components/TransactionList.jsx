import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { formatBTC } from '../utils/formatBTC';
import TransactionCard from './TransactionCard';
import EmptyState from './UI/EmptyState';
import Badge from './UI/Badge';
import Card from './UI/Card';
import { InlineSpinner, Loader } from './UI/Loader';
import { fadeUp, listItemReveal, softStagger } from '../utils/motion';

function TransactionList({
  transactions,
  onSelectTransaction,
  selectedTransactionId,
  loading,
  loadingMoreTransactions,
  hasMoreTransactions,
  onLoadMoreTransactions,
  netFlow,
}) {
  const netFlowTone =
    netFlow > 0 ? 'text-emerald-300' : netFlow < 0 ? 'text-rose-300' : 'text-slate-200';
  const netFlowLabel =
    netFlow > 0 ? 'incoming' : netFlow < 0 ? 'outgoing' : 'balanced';

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
      <Card className="p-6 lg:p-7">
      <div className="flex flex-col gap-4 border-b border-white/6 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Transaction History</p>
          <h2 className="mt-2 font-display text-[2rem] tracking-[-0.04em] text-slate-50">Address activity timeline</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            Net values are calculated relative to the searched address, including change outputs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {loading ? <InlineSpinner /> : null}
          <Badge variant="accent">{transactions.length} entries</Badge>
        </div>
      </div>

      {transactions.length > 0 ? (
        <motion.div variants={listItemReveal} className="mt-5 rounded-[24px] border border-white/8 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Net Flow</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <p className={`font-display text-2xl ${netFlowTone}`}>
              {netFlow > 0 ? '+' : netFlow < 0 ? '-' : ''}
              {formatBTC(Math.abs(netFlow))}
            </p>
            <Badge variant={netFlow > 0 ? 'success' : netFlow < 0 ? 'danger' : 'subtle'}>
              {netFlowLabel}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            Net address flow across the transactions currently loaded into the explorer.
          </p>
        </motion.div>
      ) : null}

      {loading && transactions.length === 0 ? (
        <Loader className="pt-6" label="Loading transactions..." />
      ) : transactions.length === 0 ? (
        <div className="pt-6">
          <EmptyState
            icon={Activity}
            title="No transaction history found"
            description="This address has no transaction history yet"
          />
        </div>
      ) : (
        <motion.div initial="hidden" animate="visible" variants={softStagger} className="mt-6 space-y-3">
          {transactions.map((transaction) => (
            <motion.div key={transaction.txid} variants={listItemReveal}>
              <TransactionCard
                transaction={transaction}
                onSelect={onSelectTransaction}
                selected={selectedTransactionId === transaction.txid}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {transactions.length > 0 ? (
        <motion.div variants={listItemReveal} className="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            {hasMoreTransactions
              ? 'Load the next Esplora chain page to continue browsing older activity.'
              : 'All available chain transactions loaded for this address.'}
          </p>

          <button
            type="button"
            onClick={onLoadMoreTransactions}
            disabled={!hasMoreTransactions || loadingMoreTransactions}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:-translate-y-0.5 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingMoreTransactions ? <InlineSpinner /> : null}
            {loadingMoreTransactions ? 'Loading more...' : hasMoreTransactions ? 'Load more' : 'No more transactions'}
          </button>
        </motion.div>
      ) : null}
    </Card>
    </motion.div>
  );
}

export default TransactionList;
