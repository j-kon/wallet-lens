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
  pendingTransactions = [],
  feeBands,
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
  const totalEntries = transactions.length + pendingTransactions.length;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
      <Card className="p-5 lg:p-6">
        <div className="flex flex-col gap-3.5 border-b border-white/6 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Transaction History</p>
            <h2 className="mt-2 font-display text-[1.7rem] tracking-[-0.04em] text-slate-50">
              Address activity timeline
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Net values are calculated relative to the searched address, including change outputs.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {loading ? <InlineSpinner /> : null}
            <Badge variant="accent">{totalEntries} entries</Badge>
            {pendingTransactions.length > 0 ? (
              <Badge variant="warning">{pendingTransactions.length} pending</Badge>
            ) : null}
          </div>
        </div>

        {pendingTransactions.length > 0 ? (
          <motion.div
            variants={listItemReveal}
            className="mt-4 rounded-[24px] border border-amber-400/18 bg-[linear-gradient(180deg,rgba(245,158,11,0.12),rgba(15,12,8,0.22))] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-amber-200/75">
                  Pending Transactions
                </p>
                <p className="mt-1 text-sm text-amber-50">
                  Unconfirmed mempool activity currently associated with this address.
                </p>
              </div>
              <Badge variant="warning">Mempool</Badge>
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={softStagger}
              className="mt-3 space-y-2.5"
            >
              {pendingTransactions.map((transaction) => (
                <motion.div key={transaction.txid} variants={listItemReveal}>
                  <TransactionCard
                    transaction={transaction}
                    feeBands={feeBands}
                    onSelect={onSelectTransaction}
                    selected={selectedTransactionId === transaction.txid}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : null}

        {totalEntries > 0 ? (
          <motion.div
            variants={listItemReveal}
            className="mt-3.5 flex flex-col gap-3 rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(10,14,22,0.18))] px-4 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Net Flow</p>
              <p className="mt-1 text-sm text-slate-400">
                Across the transactions currently loaded into the explorer.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <p className={`font-display text-[1.6rem] ${netFlowTone}`}>
                {netFlow > 0 ? '+' : netFlow < 0 ? '-' : ''}
                {formatBTC(Math.abs(netFlow))}
              </p>
              <Badge variant={netFlow > 0 ? 'success' : netFlow < 0 ? 'danger' : 'subtle'}>
                {netFlowLabel}
              </Badge>
            </div>
          </motion.div>
        ) : null}

        {loading && transactions.length === 0 ? (
          <Loader className="pt-5" label="Loading transactions..." />
        ) : transactions.length === 0 && pendingTransactions.length === 0 ? (
          <div className="pt-5">
            <EmptyState
              icon={Activity}
              title="No transaction history found"
              description="This address has no transaction history yet"
            />
          </div>
        ) : transactions.length === 0 ? (
          <div className="pt-5">
            <div className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-3.5 text-sm text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              No confirmed chain transactions are loaded yet. Pending mempool activity is shown above.
            </div>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={softStagger} className="mt-4.5 space-y-2.5">
            {transactions.map((transaction) => (
              <motion.div key={transaction.txid} variants={listItemReveal}>
                <TransactionCard
                  transaction={transaction}
                  feeBands={feeBands}
                  onSelect={onSelectTransaction}
                  selected={selectedTransactionId === transaction.txid}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {transactions.length > 0 ? (
          <motion.div
            variants={listItemReveal}
            className="mt-4.5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm text-slate-400">
              {hasMoreTransactions
                ? 'Load the next Esplora chain page to continue browsing older activity.'
                : 'All available chain transactions loaded for this address.'}
            </p>

            <button
              type="button"
              onClick={onLoadMoreTransactions}
              disabled={!hasMoreTransactions || loadingMoreTransactions}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[20px] border border-white/10 bg-white/[0.04] px-4 text-sm font-medium text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:-translate-y-0.5 hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingMoreTransactions ? <InlineSpinner /> : null}
              {loadingMoreTransactions
                ? 'Loading more...'
                : hasMoreTransactions
                  ? 'Load more'
                  : 'No more transactions'}
            </button>
          </motion.div>
        ) : null}
      </Card>
    </motion.div>
  );
}

export default TransactionList;
