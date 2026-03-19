import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { formatBTC, formatSats } from '../utils/formatBTC';
import { shortenTxid } from '../utils/shortenTxid';
import Badge from './UI/Badge';
import Card from './UI/Card';
import EmptyState from './UI/EmptyState';
import { fadeUp, hoverLift, listItemReveal, softStagger } from '../utils/motion';

function UtxoPanel({ utxos }) {
  const utxoBalance = utxos.reduce((sum, utxo) => sum + (utxo.value ?? 0), 0);
  const confirmedCount = utxos.filter((utxo) => utxo.status?.confirmed).length;
  const pendingCount = utxos.length - confirmedCount;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
      <Card className="p-6 lg:p-7 xl:sticky xl:top-24">
      <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">UTXO Panel</p>
          <h2 className="mt-2 font-display text-[2rem] tracking-[-0.04em] text-slate-50">Spendable outputs</h2>
          <p className="mt-3 text-sm leading-7 text-slate-400">
            UTXOs are unspent outputs that can be used to build new transactions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="accent">{utxos.length} outputs</Badge>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-brand-sky">
            <Coins className="h-5 w-5" />
          </div>
        </div>
      </div>

      {utxos.length === 0 ? (
        <div className="pt-6">
          <EmptyState
            icon={Coins}
            title="No spendable outputs found"
            description="UTXOs are unspent outputs that can be used to build new transactions."
          />
        </div>
      ) : (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={softStagger}
            className="mt-6 grid gap-3 sm:grid-cols-2"
          >
            <motion.div variants={listItemReveal} whileHover={hoverLift} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Confirmation Mix</p>
              <p className="mt-2 text-sm text-slate-200">{confirmedCount} confirmed • {pendingCount} pending</p>
            </motion.div>
            <motion.div variants={listItemReveal} whileHover={hoverLift} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Sort Order</p>
              <p className="mt-2 text-sm text-slate-200">Outputs are sorted by amount, largest first.</p>
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" animate="visible" variants={softStagger} className="mt-6 space-y-3">
            {utxos.map((utxo, index) => (
              <motion.div
                key={`${utxo.txid}:${utxo.vout}`}
                variants={listItemReveal}
                whileHover={hoverLift}
                className={`rounded-[22px] border p-4 ${
                  index === 0
                    ? 'border-brand-amber/28 bg-[linear-gradient(180deg,rgba(216,164,91,0.1),rgba(255,255,255,0.02))] shadow-[0_20px_40px_rgba(216,164,91,0.08)]'
                    : 'border-white/8 bg-white/[0.03]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm text-slate-100">
                      {shortenTxid(utxo.txid)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Output #{utxo.vout}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {index === 0 ? <Badge variant="testnet">Largest</Badge> : null}
                    <Badge variant={utxo.status?.confirmed ? 'success' : 'warning'}>
                      {utxo.status?.confirmed ? 'Confirmed' : 'Pending'}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Amount</p>
                    <p className="mt-1 font-display text-xl text-slate-50">{formatBTC(utxo.value)}</p>
                    <p className="mt-1 text-xs text-slate-400">{formatSats(utxo.value)}</p>
                  </div>
                  <p className="text-xs text-slate-400">
                    {utxo.confirmations ? `${utxo.confirmations} confirmations` : 'Awaiting first confirmation'}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={listItemReveal} className="mt-6 rounded-[24px] border border-brand-amber/15 bg-brand-amber/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Visible UTXO Balance</p>
            <p className="mt-2 font-display text-2xl text-brand-amber">{formatBTC(utxoBalance)}</p>
            <p className="mt-1 text-sm text-slate-400">{formatSats(utxoBalance)}</p>
          </motion.div>
        </>
      )}
    </Card>
    </motion.div>
  );
}

export default UtxoPanel;
