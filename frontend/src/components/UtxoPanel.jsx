import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';
import { formatBTC, formatSats } from '../utils/formatBTC';
import { shortenTxid } from '../utils/shortenTxid';
import Badge from './UI/Badge';
import Card from './UI/Card';
import { fadeUp, hoverLift, listItemReveal, softStagger } from '../utils/motion';

function UtxoPanel({ utxos }) {
  const utxoBalance = utxos.reduce((sum, utxo) => sum + (utxo.value ?? 0), 0);
  const confirmedCount = utxos.filter((utxo) => utxo.status?.confirmed).length;
  const pendingCount = utxos.length - confirmedCount;

  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
      <Card className="p-5 lg:p-6 xl:sticky xl:top-24">
        <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">UTXO Panel</p>
            <h2 className="mt-2 font-display text-[1.7rem] tracking-[-0.04em] text-slate-50">
              Spendable outputs
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              UTXOs are unspent outputs that can be used to build new transactions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="accent">{utxos.length} outputs</Badge>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2.5 text-brand-sky">
              <Coins className="h-4.5 w-4.5" />
            </div>
          </div>
        </div>

        {utxos.length === 0 ? (
          <div className="pt-5">
            <motion.div
              variants={listItemReveal}
              className="relative overflow-hidden rounded-[28px] border border-dashed border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] px-6 py-7 text-center"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(142,178,198,0.08),transparent_48%)] opacity-80" />
              <div className="relative mx-auto flex h-18 w-18 items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.05] shadow-[0_16px_40px_rgba(3,7,18,0.32)]">
                <Coins className="h-7 w-7 text-slate-100" />
              </div>
              <h3 className="relative mt-4.5 font-display text-[1.28rem] tracking-tight text-slate-100">
                No spendable outputs found
              </h3>
              <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                This address does not currently expose any spendable UTXOs. New confirmed outputs will appear here as soon as they are available.
              </p>

              <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[22px] border border-white/8 bg-black/10 p-4 text-left">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                    Visible UTXO Balance
                  </p>
                  <p className="mt-2 font-display text-xl text-slate-50">{formatBTC(0)}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatSats(0)}</p>
                </div>
                <div className="rounded-[22px] border border-white/8 bg-black/10 p-4 text-left">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Status</p>
                  <p className="mt-2 text-sm text-slate-200">Waiting for the first spendable output</p>
                  <p className="mt-1.5 text-xs leading-5 text-slate-400">Pending or future outputs will surface here automatically.</p>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={softStagger}
              className="mt-4.5 grid gap-3 sm:grid-cols-2"
            >
              <motion.div
                variants={listItemReveal}
                whileHover={hoverLift}
                className="rounded-[24px] border border-white/8 bg-white/[0.03] p-3.5"
              >
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Confirmation Mix</p>
                <p className="mt-2 text-sm text-slate-200">
                  {confirmedCount} confirmed • {pendingCount} pending
                </p>
              </motion.div>
              <motion.div
                variants={listItemReveal}
                whileHover={hoverLift}
                className="rounded-[24px] border border-white/8 bg-white/[0.03] p-3.5"
              >
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Sort Order</p>
                <p className="mt-2 text-sm text-slate-200">Outputs are sorted by amount, largest first.</p>
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={softStagger}
              className="mt-4.5 space-y-2.5"
            >
              {utxos.map((utxo, index) => (
                <motion.div
                  key={`${utxo.txid}:${utxo.vout}`}
                  variants={listItemReveal}
                  whileHover={hoverLift}
                  className={`rounded-[22px] border p-3.5 ${
                    index === 0
                      ? 'border-brand-amber/28 bg-[linear-gradient(180deg,rgba(216,164,91,0.1),rgba(255,255,255,0.02))] shadow-[0_18px_36px_rgba(216,164,91,0.08)]'
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

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Amount</p>
                      <p className="mt-1 font-display text-[1.35rem] text-slate-50">
                        {formatBTC(utxo.value)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{formatSats(utxo.value)}</p>
                    </div>
                    <p className="text-xs text-slate-400">
                      {utxo.confirmations
                        ? `${utxo.confirmations} confirmations`
                        : 'Awaiting first confirmation'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={listItemReveal} className="mt-4.5 rounded-[24px] border border-brand-amber/15 bg-brand-amber/5 p-3.5">
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
