import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Clock3 } from 'lucide-react';
import { formatDate } from '../utils/formatDate';
import { formatBTC, formatFeeRate, formatSats } from '../utils/formatBTC';
import { shortenTxid } from '../utils/shortenTxid';
import Badge from './UI/Badge';
import CopyButton from './UI/CopyButton';

const directionStyles = {
  incoming: {
    tone: 'text-emerald-300',
    border: 'from-emerald-300/0 via-emerald-300/40 to-emerald-300/0',
    icon: ArrowDownRight,
  },
  outgoing: {
    tone: 'text-rose-300',
    border: 'from-rose-300/0 via-rose-300/40 to-rose-300/0',
    icon: ArrowUpRight,
  },
  neutral: {
    tone: 'text-slate-200',
    border: 'from-slate-300/0 via-slate-300/30 to-slate-300/0',
    icon: Clock3,
  },
};

function TransactionCard({ transaction, onSelect, selected }) {
  const direction = directionStyles[transaction.direction] ?? directionStyles.neutral;
  const DirectionIcon = direction.icon;
  const directionPrefix = transaction.direction === 'incoming' ? '+' : transaction.direction === 'outgoing' ? '-' : '';

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      type="button"
      onClick={() => onSelect(transaction)}
      className={`group relative w-full overflow-hidden rounded-[24px] border p-5 text-left transition ${
        selected
          ? 'border-brand-sky/35 bg-brand-sky/[0.08] shadow-halo'
          : 'border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]'
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${direction.border}`} />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className={`rounded-xl border border-white/10 bg-white/[0.04] p-2 ${direction.tone}`}>
                <DirectionIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-mono text-sm text-slate-100">
                  {shortenTxid(transaction.txid)}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {transaction.status?.confirmed
                    ? `Block ${transaction.status.block_height}`
                    : 'Currently in mempool'}
                </p>
              </div>
            </div>

            <CopyButton
              value={transaction.txid}
              label="Copy transaction id"
              compact
              onClick={(event) => event.stopPropagation()}
              className="shrink-0"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge variant={transaction.status?.confirmed ? 'success' : 'warning'}>
              {transaction.status?.confirmed ? 'Confirmed' : 'Pending'}
            </Badge>
            {transaction.confirmations ? (
              <Badge variant="subtle">{transaction.confirmations} conf</Badge>
            ) : null}
          </div>
        </div>

        <div className="text-left lg:text-right">
          <p className={`font-display text-2xl tracking-tight ${direction.tone}`}>
            {directionPrefix}
            {formatBTC(transaction.displayAmount)}
          </p>
          <p className="mt-2 text-sm text-slate-400">{formatDate(transaction.status?.block_time)}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-400 sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Fee</p>
          <p className="mt-1 text-slate-200">{formatSats(transaction.fee)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Fee Rate</p>
          <p className="mt-1 text-slate-200">{formatFeeRate(transaction.feeRate)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Flow</p>
          <p className="mt-1 capitalize text-slate-200">{transaction.direction === 'neutral' ? 'observed' : transaction.direction}</p>
        </div>
      </div>
    </motion.button>
  );
}

export default TransactionCard;
