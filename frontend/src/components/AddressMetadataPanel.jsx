import { motion } from 'framer-motion';
import { Layers3, RadioTower, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatBTC, formatSats } from '../utils/formatBTC';
import { formatDateTime, formatRelativeTime } from '../utils/formatDate';
import { getAddressRoute } from '../utils/explorerLinks';
import Badge from './UI/Badge';
import Card from './UI/Card';
import { fadeUp, hoverLift, listItemReveal, softStagger } from '../utils/motion';

function MetadataRow({ label, value, helper }) {
  return (
    <motion.div
      variants={listItemReveal}
      whileHover={hoverLift}
      className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
    >
      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-2 text-base font-medium tracking-tight text-slate-100">{value}</p>
      {helper ? <p className="mt-1 text-sm text-slate-400">{helper}</p> : null}
    </motion.div>
  );
}

function AddressMetadataPanel({ address, metadata }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
      <Card className="p-5 lg:p-6">
        <div className="flex flex-col gap-4 border-b border-white/6 pb-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Address Metadata</p>
            <h2 className="mt-2 font-display text-[1.7rem] tracking-[-0.04em] text-slate-50">
              Wallet context
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Compact address metadata for wallet-level inspection and internal explorer navigation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="testnet">Testnet</Badge>
            <Link
              to={getAddressRoute(address)}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
            >
              Open address page
            </Link>
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={softStagger}
          className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5"
        >
          <MetadataRow
            label="Address Type"
            value={metadata.addressType}
            helper="Detected from the current prefix"
          />
          <MetadataRow
            label="Network"
            value={metadata.network}
            helper="WalletLens testnet route"
          />
          <MetadataRow
            label="Total UTXOs"
            value={String(metadata.utxoCount)}
            helper="Spendable outputs currently visible"
          />
          <MetadataRow
            label="Largest UTXO"
            value={formatBTC(metadata.largestUtxo)}
            helper={formatSats(metadata.largestUtxo)}
          />
          <MetadataRow
            label="Last Activity"
            value={
              metadata.lastActivityTimestamp
                ? formatRelativeTime(metadata.lastActivityTimestamp)
                : 'No confirmed activity'
            }
            helper={
              metadata.lastActivityTimestamp
                ? formatDateTime(metadata.lastActivityTimestamp)
                : 'No block timestamp available yet'
            }
          />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={softStagger}
          className="mt-5 grid gap-3 sm:grid-cols-3"
        >
          <motion.div
            variants={listItemReveal}
            whileHover={hoverLift}
            className="rounded-[24px] border border-white/8 bg-white/[0.03] p-3.5 text-sm text-slate-300"
          >
            <div className="flex items-center gap-2 text-slate-100">
              <ShieldCheck className="h-4 w-4 text-brand-amber" />
              Address verified
            </div>
            <p className="mt-2 text-slate-400">
              Requests are only sent after the Bech32 testnet format passes validation.
            </p>
          </motion.div>
          <motion.div
            variants={listItemReveal}
            whileHover={hoverLift}
            className="rounded-[24px] border border-white/8 bg-white/[0.03] p-3.5 text-sm text-slate-300"
          >
            <div className="flex items-center gap-2 text-slate-100">
              <Layers3 className="h-4 w-4 text-brand-sky" />
              UTXO-aware
            </div>
            <p className="mt-2 text-slate-400">
              The largest output and the total count are derived directly from the spendable set.
            </p>
          </motion.div>
          <motion.div
            variants={listItemReveal}
            whileHover={hoverLift}
            className="rounded-[24px] border border-white/8 bg-white/[0.03] p-3.5 text-sm text-slate-300"
          >
            <div className="flex items-center gap-2 text-slate-100">
              <RadioTower className="h-4 w-4 text-emerald-300" />
              Route-linked
            </div>
            <p className="mt-2 text-slate-400">
              Related addresses, transactions, and blocks stay inside WalletLens instead of leaving the app.
            </p>
          </motion.div>
        </motion.div>
      </Card>
    </motion.div>
  );
}

export default AddressMetadataPanel;
