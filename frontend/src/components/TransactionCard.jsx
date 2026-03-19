import { motion } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, Clock3, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatTimestampWithRelative } from '../utils/formatDate';
import { formatBTC, formatFeeRate, formatSats } from '../utils/formatBTC';
import { getFeeInsight } from '../utils/feeInsights';
import { getTransactionExplorerUrl, getTransactionRoute } from '../utils/explorerLinks';
import { shortenTxid } from '../utils/shortenTxid';
import Badge from './UI/Badge';
import CopyButton from './UI/CopyButton';
import { hoverLift } from '../utils/motion';

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

function TransactionCard({ transaction, feeBands, onSelect, selected }) {
  const direction = directionStyles[transaction.direction] ?? directionStyles.neutral;
  const DirectionIcon = direction.icon;
  const directionPrefix = transaction.direction === 'incoming' ? '+' : transaction.direction === 'outgoing' ? '-' : '';
  const feeInsight = getFeeInsight(transaction.feeRate, feeBands);
  const hasFeeInsight = transaction.feeRate != null && Boolean(feeBands);
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(transaction);
    }
  };

  return (
    <motion.div
      whileHover={selected ? { y: -3, scale: 1.003 } : hoverLift}
      whileTap={{ scale: 0.995 }}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onClick={() => onSelect(transaction)}
      className={`group relative w-full cursor-pointer overflow-hidden rounded-[24px] border p-3.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-sky/35 ${
        selected
          ? 'border-brand-sky/45 bg-[linear-gradient(180deg,rgba(142,178,198,0.12),rgba(18,26,38,0.82))] shadow-[0_20px_60px_rgba(9,15,24,0.44),0_0_0_1px_rgba(142,178,198,0.16),0_0_36px_rgba(142,178,198,0.14)]'
          : 'border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.02))] hover:border-white/15 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))]'
      }`}
    >
      <motion.div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${direction.border}`}
        animate={selected ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.8 }}
        transition={{ duration: 2.4, repeat: selected ? Infinity : 0, ease: 'easeInOut' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_34%)] opacity-80" />
      {selected ? (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[24px] border border-brand-sky/20"
          animate={{ opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      ) : null}

      <div className="relative flex flex-col gap-3.5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className={`rounded-[18px] border border-white/10 bg-white/[0.05] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ${direction.tone}`}>
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

            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              <Link
                to={getTransactionRoute(transaction.txid)}
                onClick={(event) => {
                  event.stopPropagation();
                }}
                className="inline-flex h-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white"
              >
                Tx page
              </Link>
              <a
                href={getTransactionExplorerUrl(transaction.txid)}
                target="_blank"
                rel="noreferrer"
                onClick={(event) => event.stopPropagation()}
                className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white"
                aria-label="View transaction on Blockstream Explorer"
                title="View transaction on Blockstream Explorer"
              >
                <ExternalLink className="h-4 w-4 text-brand-sky" />
              </a>
              <CopyButton
                value={transaction.txid}
                label="Copy transaction id"
                compact
                onClick={(event) => event.stopPropagation()}
                className="shrink-0"
              />
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Badge variant={transaction.status?.confirmed ? 'success' : 'warning'}>
              {transaction.status?.confirmed ? 'Confirmed' : 'Pending'}
            </Badge>
            {transaction.confirmations ? (
              <Badge variant="subtle">{transaction.confirmations} conf</Badge>
            ) : null}
            {hasFeeInsight ? (
              <Badge variant={feeInsight.variant}>{feeInsight.label}</Badge>
            ) : null}
          </div>
        </div>

        <div className="text-left lg:w-52 lg:text-right">
          <p className={`font-display text-[1.65rem] tracking-[-0.04em] ${direction.tone}`}>
            {directionPrefix}
            {formatBTC(transaction.displayAmount)}
          </p>
          <p className="mt-1 text-sm leading-6 text-slate-400">
            {formatTimestampWithRelative(transaction.status?.block_time)}
          </p>
        </div>
      </div>

      <div className="relative mt-3.5 grid gap-2.5 text-sm text-slate-400 sm:grid-cols-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Fee</p>
          <p className="mt-1 text-slate-200">{formatSats(transaction.fee)}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Fee Rate</p>
          <p className="mt-1 text-slate-200">{formatFeeRate(transaction.feeRate)}</p>
          {hasFeeInsight ? <p className="mt-1 text-xs text-slate-500">{feeInsight.helper}</p> : null}
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Flow</p>
          <p className="mt-1 capitalize text-slate-200">{transaction.direction === 'neutral' ? 'observed' : transaction.direction}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default TransactionCard;
