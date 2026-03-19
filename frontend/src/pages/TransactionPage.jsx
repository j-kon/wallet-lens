import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Blocks,
  Clock3,
  ExternalLink,
  Scale,
} from 'lucide-react';
import AddressSearch from '../components/AddressSearch';
import Navbar from '../components/Navbar';
import Badge from '../components/UI/Badge';
import Card from '../components/UI/Card';
import CopyButton from '../components/UI/CopyButton';
import EmptyState from '../components/UI/EmptyState';
import { Loader, Skeleton } from '../components/UI/Loader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useFeeEstimates } from '../hooks/useFeeEstimates';
import { useTxDetails } from '../hooks/useTxDetails';
import { DEMO_TESTNET_ADDRESS } from '../services/demoAddress';
import { formatBTC, formatFeeRate, formatSats } from '../utils/formatBTC';
import { formatDateTime, formatTimestampWithRelative } from '../utils/formatDate';
import {
  getAddressRoute,
  getBlockRoute,
  getAddressExplorerUrl,
  getHomeRoute,
  getTransactionRoute,
  getTransactionExplorerUrl,
} from '../utils/explorerLinks';
import { getFeeInsight } from '../utils/feeInsights';
import { fadeUp, getReveal, hoverLift, listItemReveal, softStagger } from '../utils/motion';
import { shortenTxid } from '../utils/shortenTxid';
import { detectSearchTarget, normalizeSearchInput } from '../utils/searchTarget';

function getUniversalSearchMessage() {
  return {
    title: 'Enter a testnet address or transaction id',
    description:
      'Use a Bech32 testnet address beginning with tb1 or a 64-character transaction id.',
  };
}

function getTransactionErrorCopy(error) {
  if (error === 'Transaction not found') {
    return {
      title: 'Transaction not found',
      description:
        'The provided transaction id is not available on Blockstream testnet. Confirm the txid and try again.',
    };
  }

  return {
    title: 'Unable to fetch transaction',
    description:
      'WalletLens could not load this transaction from the network. Check your connection and try again.',
  };
}

function MetricCard({ label, value, helper, icon: Icon }) {
  return (
    <motion.div
      variants={listItemReveal}
      whileHover={hoverLift}
      className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{label}</p>
        {Icon ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-brand-sky">
            <Icon className="h-4 w-4" />
          </div>
        ) : null}
      </div>
      <p className="mt-4 font-display text-[1.85rem] tracking-[-0.04em] text-slate-50">{value}</p>
      {helper ? <p className="mt-2 text-sm leading-6 text-slate-400">{helper}</p> : null}
    </motion.div>
  );
}

function AddressField({ address }) {
  if (!address) {
    return <p className="mt-2 text-sm text-slate-500">Address unavailable</p>;
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <Link
        to={getAddressRoute(address)}
        className="break-all font-mono text-xs leading-6 text-slate-100 transition hover:text-brand-sky"
      >
        {address}
      </Link>
      <CopyButton value={address} label="Copy address" compact />
      <a
        href={getAddressExplorerUrl(address)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
        aria-label="View address on Blockstream Explorer"
        title="View address on Blockstream Explorer"
      >
        <ExternalLink className="h-4 w-4 text-brand-sky" />
      </a>
    </div>
  );
}

function EndpointRow({ item, index, kind, showWitness }) {
  const isInput = kind === 'vin';
  const previousTxid = isInput ? item?.txid : null;
  const address =
    item?.prevout?.scriptpubkey_address ??
    item?.scriptpubkey_address ??
    '';
  const value = item?.prevout?.value ?? item?.value ?? 0;
  const scriptType = item?.prevout?.scriptpubkey_type ?? item?.scriptpubkey_type ?? 'script';

  return (
    <motion.div
      variants={listItemReveal}
      whileHover={hoverLift}
      className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            {isInput ? `Input #${index}` : `Output #${index}`}
          </p>

          {previousTxid ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <p className="font-mono text-xs text-slate-200">{shortenTxid(previousTxid)}</p>
              <CopyButton value={previousTxid} label="Copy previous transaction id" compact />
              <Link
                to={getTransactionRoute(previousTxid)}
                className="inline-flex items-center rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-200 transition hover:bg-white/[0.08] hover:text-white"
              >
                Open tx
              </Link>
            </div>
          ) : null}

          <div className="mt-4 rounded-2xl border border-white/8 bg-black/10 p-3">
            <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Address</p>
            <AddressField address={address} />
          </div>

          {isInput && item?.scriptsig_asm ? (
            <div className="mt-4 rounded-2xl border border-white/8 bg-black/10 p-3">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">ScriptSig ASM</p>
              <p className="mt-2 break-all font-mono text-[11px] leading-6 text-slate-200">
                {item.scriptsig_asm}
              </p>
            </div>
          ) : null}

          {showWitness && isInput && Array.isArray(item?.witness) && item.witness.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-white/8 bg-black/10 p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">Witness Stack</p>
                <Badge variant="subtle">{item.witness.length} items</Badge>
              </div>
              <div className="mt-3 space-y-2">
                {item.witness.map((witnessItem, witnessIndex) => (
                  <div
                    key={`${previousTxid ?? address}-${witnessIndex}`}
                    className="break-all rounded-2xl border border-white/8 bg-white/[0.03] px-3 py-2 font-mono text-[11px] leading-6 text-slate-200"
                  >
                    {witnessItem}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="lg:w-56 lg:text-right">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Value</p>
          <p className="mt-2 font-display text-2xl text-slate-50">{formatBTC(value)}</p>
          <p className="mt-2 text-sm text-slate-400">{formatSats(value)}</p>
          <p className="mt-4 text-sm text-slate-400">
            {isInput ? `Prevout type: ${scriptType}` : `Script type: ${scriptType}`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function EndpointSection({ title, items, kind, showWitness }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp}>
      <Card className="h-full p-6 lg:p-7">
        <div className="flex items-center justify-between gap-3 border-b border-white/6 pb-5">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{title}</p>
            <h2 className="mt-2 font-display text-[2rem] tracking-[-0.04em] text-slate-50">
              {kind === 'vin' ? 'Source inputs' : 'Produced outputs'}
            </h2>
          </div>
          <Badge variant="accent">{items.length} entries</Badge>
        </div>

        {items.length === 0 ? (
          <div className="pt-6">
            <EmptyState
              title={`No ${kind === 'vin' ? 'inputs' : 'outputs'} available`}
              description="This transaction response does not include any entries for the selected section."
            />
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={softStagger} className="mt-6 space-y-3">
            {items.map((item, index) => (
              <EndpointRow
                key={`${kind}-${item.txid ?? item.scriptpubkey ?? index}-${index}`}
                item={item}
                index={index}
                kind={kind}
                showWitness={showWitness}
              />
            ))}
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}

function TransactionPageSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-4 h-10 w-3/4" />
        <Skeleton className="mt-4 h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-10 w-28" />
            <Skeleton className="mt-3 h-4 w-full" />
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {[...Array(2)].map((_, index) => (
          <Card key={index} className="p-6">
            <Skeleton className="h-6 w-32" />
            <div className="mt-6 space-y-3">
              {[...Array(3)].map((__, rowIndex) => (
                <Skeleton key={rowIndex} className="h-36 w-full rounded-[24px]" />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TransactionPage() {
  const navigate = useNavigate();
  const { txid: routeTxid } = useParams();
  const normalizedTxid = normalizeSearchInput(routeTxid ?? '');
  const [query, setQuery] = useState(normalizedTxid);
  const [searchMessage, setSearchMessage] = useState(null);
  const [showRawHex, setShowRawHex] = useState(false);
  const [showWitness, setShowWitness] = useState(false);
  const {
    selectedTransaction,
    transactionDetails,
    detailsLoading,
    detailsError,
    transactionHex,
    hexLoading,
    hexError,
    loadTransactionById,
    loadTransactionHexById,
  } = useTxDetails();
  const { feeBands, feeEstimatesLoading } = useFeeEstimates();
  useDocumentTitle('WalletLens · Transaction');

  const activeTransaction = transactionDetails ?? selectedTransaction;
  const feeInsight = getFeeInsight(transactionDetails?.feeRate, feeBands);
  const feeInsightHelper =
    feeEstimatesLoading || !feeBands
      ? 'Comparing against live fee estimates...'
      : feeInsight.helper;
  const pageError = detailsError ? getTransactionErrorCopy(detailsError) : null;

  useEffect(() => {
    if (!routeTxid || routeTxid === normalizedTxid) {
      return;
    }

    navigate(getTransactionRoute(normalizedTxid), { replace: true });
  }, [navigate, normalizedTxid, routeTxid]);

  useEffect(() => {
    setQuery(normalizedTxid);
    setSearchMessage(null);
    setShowRawHex(false);
    setShowWitness(false);
    loadTransactionById(normalizedTxid);
  }, [loadTransactionById, normalizedTxid]);

  useEffect(() => {
    if (!showRawHex || !activeTransaction?.txid || transactionHex || hexLoading) {
      return;
    }

    loadTransactionHexById(activeTransaction.txid);
  }, [
    activeTransaction?.txid,
    hexLoading,
    loadTransactionHexById,
    showRawHex,
    transactionHex,
  ]);

  const handleSearch = (event) => {
    event.preventDefault();

    const target = detectSearchTarget(query);

    if (target.type === 'address') {
      setSearchMessage(null);
      navigate(getAddressRoute(target.value));
      return;
    }

    if (target.type === 'txid') {
      setSearchMessage(null);

      if (target.value === normalizedTxid) {
        loadTransactionById(target.value);
        return;
      }

      navigate(getTransactionRoute(target.value));
      return;
    }

    setSearchMessage(getUniversalSearchMessage());
  };

  const handleUseDemo = () => {
    setSearchMessage(null);
    navigate(getAddressRoute(DEMO_TESTNET_ADDRESS));
  };

  const handleClear = () => {
    setQuery('');
    setSearchMessage(null);
  };

  return (
    <div className="min-h-screen text-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <motion.section
          initial="hidden"
          animate="visible"
          variants={softStagger}
          className="grid gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:items-start"
        >
          <motion.div variants={getReveal({ y: 20, duration: 0.56 })} className="py-4">
            <Link
              to={getHomeRoute()}
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to wallet dashboard
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge variant="testnet">Testnet Explorer</Badge>
              <Badge variant="subtle">Transaction Page</Badge>
              <Badge variant="subtle">Esplora API</Badge>
            </div>

            <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.02] tracking-[-0.06em] text-slate-50 sm:text-[3.55rem]">
              Inspect a Bitcoin transaction in full detail
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Review fee data, block placement, virtual size, and the complete vin/vout surface from a dedicated explorer page.
            </p>

            <motion.div initial="hidden" animate="visible" variants={softStagger} className="mt-8 space-y-4">
              <motion.div variants={listItemReveal}>
                <Card className="p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Requested txid</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <p className="break-all font-mono text-sm leading-7 text-slate-100">
                      {activeTransaction?.txid ?? normalizedTxid}
                    </p>
                    {activeTransaction?.txid ? (
                      <>
                        <CopyButton value={activeTransaction.txid} label="Copy transaction id" compact />
                        <a
                          href={getTransactionExplorerUrl(activeTransaction.txid)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-[20px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 transition hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white"
                        >
                          <ExternalLink className="h-4 w-4 text-brand-sky" />
                          Blockstream
                        </a>
                      </>
                    ) : null}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Badge variant={activeTransaction?.status?.confirmed ? 'success' : 'warning'}>
                      {activeTransaction?.status?.confirmed ? 'Confirmed' : 'Pending'}
                    </Badge>
                    <Badge variant="accent">Dedicated transaction route</Badge>
                    {activeTransaction?.feeRate != null ? (
                      <Badge variant={feeInsight.variant}>{feeInsight.label}</Badge>
                    ) : null}
                    {activeTransaction?.status?.block_hash ? (
                      <Link
                        to={getBlockRoute(activeTransaction.status.block_hash)}
                        className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                      >
                        Open block
                      </Link>
                    ) : null}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>

          <AddressSearch
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            onUseDemo={handleUseDemo}
            onClear={handleClear}
            isLoading={detailsLoading}
            validationError={searchMessage?.title ?? ''}
            sectionLabel="Universal Search"
            title="Open another wallet or transaction"
            description="Search by Bech32 testnet address or paste a 64-character txid to navigate directly."
          />
        </motion.section>

        {pageError && !transactionDetails && !detailsLoading ? (
          <div className="mt-8">
            <EmptyState
              icon={AlertTriangle}
              title={pageError.title}
              description={pageError.description}
              action={
                <button
                  type="button"
                  onClick={() => navigate(getHomeRoute())}
                  className="rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]"
                >
                  Return home
                </button>
              }
            />
          </div>
        ) : null}

        {detailsLoading && !transactionDetails ? (
          <section className="mt-8">
            <TransactionPageSkeleton />
          </section>
        ) : null}

        {!detailsLoading && transactionDetails ? (
          <motion.section initial="hidden" animate="visible" variants={softStagger} className="mt-8 space-y-6">
            <motion.div variants={fadeUp}>
              <Card className="p-6 lg:p-7">
                <div className="flex flex-col gap-4 border-b border-white/6 pb-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Transaction Overview</p>
                    <h2 className="mt-2 font-display text-[2rem] tracking-[-0.04em] text-slate-50">
                      On-chain execution profile
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      Explore cost, block placement, transaction footprint, and raw execution data from a single route.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={transactionDetails.status?.confirmed ? 'success' : 'warning'}>
                      {transactionDetails.status?.confirmed ? 'Confirmed' : 'Pending'}
                    </Badge>
                    {transactionDetails.confirmations ? (
                      <Badge variant="subtle">{transactionDetails.confirmations} confirmations</Badge>
                    ) : null}
                    <Badge variant={feeInsight.variant}>{feeInsight.label}</Badge>
                  </div>
                </div>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={softStagger}
                  className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                >
                  <MetricCard
                    label="Fee"
                    value={formatSats(transactionDetails.fee)}
                    helper={formatFeeRate(transactionDetails.feeRate)}
                    icon={Scale}
                  />
                  <MetricCard
                    label="Fee Posture"
                    value={feeInsight.label}
                    helper={feeInsightHelper}
                    icon={Scale}
                  />
                  <MetricCard
                    label="Confirmations"
                    value={String(transactionDetails.confirmations ?? 0)}
                    helper={
                      transactionDetails.status?.confirmed
                        ? 'Confirmed in chain history'
                        : 'Awaiting first block inclusion'
                    }
                    icon={Blocks}
                  />
                  <MetricCard
                    label="Block Height"
                    value={String(transactionDetails.status?.block_height ?? 'Pending')}
                    helper="Resolved from current tip height"
                    icon={Blocks}
                  />
                  <MetricCard
                    label="Timestamp"
                    value={
                      transactionDetails.status?.block_time
                        ? formatTimestampWithRelative(transactionDetails.status.block_time)
                        : 'Pending in mempool'
                    }
                    helper={
                      transactionDetails.status?.block_time
                        ? formatDateTime(transactionDetails.status.block_time)
                        : 'No block timestamp yet'
                    }
                    icon={Clock3}
                  />
                  <MetricCard
                    label="Virtual Size"
                    value={`${transactionDetails.vsize ?? 'n/a'} vB`}
                    helper={`${transactionDetails.size ?? 'n/a'} bytes • ${transactionDetails.weight ?? 'n/a'} weight units`}
                    icon={Scale}
                  />
                </motion.div>

                <motion.div variants={listItemReveal} className="mt-6 flex flex-wrap items-center gap-3">
                  {transactionDetails.status?.block_hash ? (
                    <Link
                      to={getBlockRoute(transactionDetails.status.block_hash)}
                      className="rounded-[20px] border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.08]"
                    >
                      Open containing block
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setShowWitness((current) => !current)}
                    className={`rounded-[20px] border px-4 py-3 text-sm font-medium transition ${
                      showWitness
                        ? 'border-brand-sky/25 bg-brand-sky/10 text-brand-sky'
                        : 'border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]'
                    }`}
                  >
                    {showWitness ? 'Hide witness data' : 'Show witness data'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowRawHex((current) => !current)}
                    className={`rounded-[20px] border px-4 py-3 text-sm font-medium transition ${
                      showRawHex
                        ? 'border-brand-amber/25 bg-brand-amber/10 text-brand-amber'
                        : 'border-white/10 bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]'
                    }`}
                  >
                    {showRawHex ? 'Hide raw hex' : 'Show raw hex'}
                  </button>
                </motion.div>

                {showRawHex ? (
                  <motion.div variants={listItemReveal} className="mt-6 rounded-[24px] border border-white/8 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Raw Transaction Hex</p>
                        <p className="mt-2 text-sm text-slate-400">
                          Fetched on demand from the Esplora hex endpoint.
                        </p>
                      </div>
                      {transactionHex ? (
                        <CopyButton value={transactionHex} label="Copy raw transaction hex" />
                      ) : null}
                    </div>

                    {hexLoading ? (
                      <div className="mt-4 rounded-2xl border border-white/8 bg-black/10 px-4 py-4 text-sm text-slate-300">
                        Loading raw transaction hex...
                      </div>
                    ) : hexError ? (
                      <div className="mt-4 rounded-2xl border border-amber-400/15 bg-amber-400/10 px-4 py-4 text-sm text-amber-100">
                        {hexError}
                      </div>
                    ) : transactionHex ? (
                      <pre className="mt-4 max-h-[420px] overflow-auto rounded-2xl border border-white/8 bg-black/20 p-4 font-mono text-[11px] leading-6 text-slate-200">
                        {transactionHex}
                      </pre>
                    ) : null}
                  </motion.div>
                ) : null}
              </Card>
            </motion.div>

            <div className="grid gap-6 xl:grid-cols-2">
              <EndpointSection
                title="Inputs"
                items={transactionDetails.vin ?? []}
                kind="vin"
                showWitness={showWitness}
              />
              <EndpointSection
                title="Outputs"
                items={transactionDetails.vout ?? []}
                kind="vout"
                showWitness={showWitness}
              />
            </div>
          </motion.section>
        ) : null}

        {!detailsLoading && !transactionDetails && !pageError ? (
          <section className="mt-8">
            <Loader label="Loading transaction..." />
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default TransactionPage;
