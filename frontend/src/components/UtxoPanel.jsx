import { Coins } from 'lucide-react';
import { formatBTC } from '../utils/formatBTC';
import { shortenTxid } from '../utils/shortenTxid';
import Badge from './UI/Badge';
import Card from './UI/Card';
import EmptyState from './UI/EmptyState';

function UtxoPanel({ utxos }) {
  const utxoBalance = utxos.reduce((sum, utxo) => sum + (utxo.value ?? 0), 0);

  return (
    <Card className="p-6 lg:p-7 xl:sticky xl:top-24">
      <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-5">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">UTXO Panel</p>
          <h2 className="mt-2 font-display text-2xl text-slate-50">Spendable output set</h2>
          <p className="mt-2 text-sm text-slate-400">
            Inspect individual outputs before they are selected by the wallet.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-brand-sky">
          <Coins className="h-5 w-5" />
        </div>
      </div>

      {utxos.length === 0 ? (
        <div className="pt-6">
          <EmptyState
            icon={Coins}
            title="No UTXOs available"
            description="This address currently has no unspent outputs visible on testnet."
          />
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-3">
            {utxos.map((utxo) => (
              <div
                key={`${utxo.txid}:${utxo.vout}`}
                className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm text-slate-100">
                      {shortenTxid(utxo.txid)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Output #{utxo.vout}</p>
                  </div>
                  <Badge variant={utxo.status?.confirmed ? 'success' : 'warning'}>
                    {utxo.status?.confirmed ? 'Confirmed' : 'Pending'}
                  </Badge>
                </div>

                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Amount</p>
                    <p className="mt-1 font-display text-xl text-slate-50">{formatBTC(utxo.value)}</p>
                  </div>
                  <p className="text-xs text-slate-400">
                    {utxo.confirmations ? `${utxo.confirmations} confirmations` : 'Awaiting first confirmation'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[22px] border border-brand-amber/15 bg-brand-amber/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Visible UTXO Balance</p>
            <p className="mt-2 font-display text-2xl text-brand-amber">{formatBTC(utxoBalance)}</p>
          </div>
        </>
      )}
    </Card>
  );
}

export default UtxoPanel;
