import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Blocks, Clock3, Scale, X } from 'lucide-react';
import { formatDateTime } from '../utils/formatDate';
import { formatBTC, formatFeeRate, formatSats } from '../utils/formatBTC';
import Badge from './UI/Badge';
import CopyButton from './UI/CopyButton';
import { Loader } from './UI/Loader';

function DetailColumn({ title, items, address, kind }) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-slate-100">{title}</p>
        <Badge variant="subtle">{items.length}</Badge>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const itemAddress =
            item?.prevout?.scriptpubkey_address ?? item?.scriptpubkey_address ?? 'Address unavailable';
          const value = item?.prevout?.value ?? item?.value ?? 0;
          const highlighted = itemAddress === address;

          return (
            <div
              key={`${kind}-${item.txid ?? itemAddress}-${index}`}
              className={`rounded-2xl border p-3 ${highlighted ? 'border-brand-sky/25 bg-brand-sky/10' : 'border-white/8 bg-black/10'}`}
            >
              <p className="break-all font-mono text-xs leading-6 text-slate-100">{itemAddress}</p>
              <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                <span className="text-slate-400">
                  {item?.txid ? `Source ${item.txid.slice(0, 8)}...` : item?.scriptpubkey_type ?? 'script'}
                </span>
                <span className="font-medium text-slate-100">{formatBTC(value)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TransactionDetailsModal({
  isOpen,
  transaction,
  details,
  address,
  isLoading,
  error,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const activeTransaction = details ?? transaction;

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-[rgba(2,6,12,0.78)] backdrop-blur-md"
            onClick={onClose}
            aria-label="Close transaction details"
          />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.985 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-[rgba(10,14,21,0.98)] shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/6 px-6 py-5 sm:px-8">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={activeTransaction?.status?.confirmed ? 'success' : 'warning'}>
                    {activeTransaction?.status?.confirmed ? 'Confirmed' : 'Pending'}
                  </Badge>
                  {isLoading ? <Badge variant="accent">Refreshing detail</Badge> : null}
                  {error ? <Badge variant="warning">Network issue</Badge> : null}
                </div>
                <h3 className="mt-3 font-display text-2xl text-slate-50">Transaction Details</h3>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <p className="break-all font-mono text-xs leading-6 text-slate-400 sm:text-sm">
                    {activeTransaction?.txid}
                  </p>
                  {activeTransaction?.txid ? (
                    <CopyButton value={activeTransaction.txid} label="Copy full transaction id" compact />
                  ) : null}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {!activeTransaction ? (
              <Loader className="px-6 sm:px-8" label="Loading transaction detail..." />
            ) : (
              <div className="max-h-[calc(92vh-96px)] overflow-y-auto px-6 py-6 sm:px-8">
                {error ? (
                  <div className="mb-5 rounded-2xl border border-amber-400/15 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                    {error}
                  </div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Fee</p>
                    <p className="mt-3 font-display text-2xl text-slate-50">{formatSats(activeTransaction.fee)}</p>
                    <p className="mt-2 text-sm text-slate-400">{formatFeeRate(activeTransaction.feeRate)}</p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Confirmations</p>
                    <p className="mt-3 font-display text-2xl text-slate-50">
                      {activeTransaction.confirmations ?? 'n/a'}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">{formatDateTime(activeTransaction.status?.block_time)}</p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                      <Blocks className="h-3.5 w-3.5" />
                      Size / Weight
                    </div>
                    <p className="mt-3 font-display text-2xl text-slate-50">{activeTransaction.vsize ?? 'n/a'} vB</p>
                    <p className="mt-2 text-sm text-slate-400">
                      {activeTransaction.size ?? 'n/a'} bytes • {activeTransaction.weight ?? 'n/a'} weight units
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                      <Scale className="h-3.5 w-3.5" />
                      Wallet Flow
                    </div>
                    <p className="mt-3 font-display text-2xl text-slate-50">
                      {activeTransaction.direction === 'incoming' ? '+' : activeTransaction.direction === 'outgoing' ? '-' : ''}
                      {formatBTC(activeTransaction.displayAmount ?? activeTransaction.netValue)}
                    </p>
                    <p className="mt-2 capitalize text-sm text-slate-400">{activeTransaction.direction}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-2">
                  <DetailColumn
                    title="Inputs"
                    items={activeTransaction.vin ?? []}
                    address={address}
                    kind="vin"
                  />
                  <DetailColumn
                    title="Outputs"
                    items={activeTransaction.vout ?? []}
                    address={address}
                    kind="vout"
                  />
                </div>

                <div className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-slate-500">
                    <Clock3 className="h-3.5 w-3.5" />
                    Execution Metadata
                  </div>
                  <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-2">
                    <p>Version: {activeTransaction.version ?? 'n/a'}</p>
                    <p>Locktime: {activeTransaction.locktime ?? 'n/a'}</p>
                    <p>Block Height: {activeTransaction.status?.block_height ?? 'Pending'}</p>
                    <p>Virtual Size: {activeTransaction.vsize ?? 'n/a'} vB</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default TransactionDetailsModal;
