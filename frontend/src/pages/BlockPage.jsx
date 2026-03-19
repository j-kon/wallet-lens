import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  Blocks,
  Clock3,
  Layers3,
  Scale,
} from 'lucide-react';
import AddressSearch from '../components/AddressSearch';
import Navbar from '../components/Navbar';
import Badge from '../components/UI/Badge';
import Card from '../components/UI/Card';
import CopyButton from '../components/UI/CopyButton';
import EmptyState from '../components/UI/EmptyState';
import { Loader, Skeleton } from '../components/UI/Loader';
import { useBlockDetails } from '../hooks/useBlockDetails';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { DEMO_TESTNET_ADDRESS } from '../services/demoAddress';
import { formatFeeRate, formatSats } from '../utils/formatBTC';
import { formatDateTime, formatTimestampWithRelative } from '../utils/formatDate';
import {
  getAddressRoute,
  getBlockRoute,
  getHomeRoute,
  getTransactionRoute,
} from '../utils/explorerLinks';
import { formatBytes, formatNumber } from '../utils/formatNumber';
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

function getBlockErrorCopy(error) {
  if (error === 'Block not found') {
    return {
      title: 'Block not found',
      description:
        'The provided block height or hash is not available on Blockstream testnet. Confirm the identifier and try again.',
    };
  }

  return {
    title: 'Unable to fetch block',
    description:
      'WalletLens could not load this block from the network. Check your connection and try again.',
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

function ChainLinkCard({ label, blockHash, helper }) {
  return (
    <motion.div
      variants={listItemReveal}
      whileHover={hoverLift}
      className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
    >
      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">{label}</p>
      {blockHash ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            to={getBlockRoute(blockHash)}
            className="font-mono text-sm text-slate-100 transition hover:text-brand-sky"
          >
            {shortenTxid(blockHash)}
          </Link>
          <CopyButton value={blockHash} label={`Copy ${label.toLowerCase()} hash`} compact />
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">Unavailable</p>
      )}
      <p className="mt-2 text-sm text-slate-400">{helper}</p>
    </motion.div>
  );
}

function BlockTransactionRow({ transaction, blockTimestamp }) {
  return (
    <motion.div
      variants={listItemReveal}
      whileHover={hoverLift}
      className="rounded-[22px] border border-white/8 bg-white/[0.03] p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={getTransactionRoute(transaction.txid)}
              className="truncate font-mono text-sm text-slate-100 transition hover:text-brand-sky"
            >
              {shortenTxid(transaction.txid)}
            </Link>
            <CopyButton value={transaction.txid} label="Copy transaction id" compact />
            <Badge variant="success">Confirmed</Badge>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            {formatTimestampWithRelative(transaction.status?.block_time ?? blockTimestamp)}
          </p>
        </div>

        <div className="grid gap-3 text-sm text-slate-400 sm:grid-cols-3 lg:text-right">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Fee</p>
            <p className="mt-1 text-slate-200">{formatSats(transaction.fee)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Fee Rate</p>
            <p className="mt-1 text-slate-200">{formatFeeRate(transaction.feeRate)}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Virtual Size</p>
            <p className="mt-1 text-slate-200">{formatNumber(transaction.vsize ?? 0)} vB</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BlockPageSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-4 h-10 w-3/4" />
        <Skeleton className="mt-4 h-4 w-full" />
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
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Card className="p-6">
          <Skeleton className="h-6 w-36" />
          <div className="mt-5 space-y-3">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-[24px]" />
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <Skeleton className="h-6 w-28" />
          <div className="mt-5 space-y-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-24 w-full rounded-[24px]" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function BlockPage() {
  const navigate = useNavigate();
  const { blockId: routeBlockId } = useParams();
  const normalizedBlockId = normalizeSearchInput(routeBlockId ?? '');
  const [query, setQuery] = useState('');
  const [searchMessage, setSearchMessage] = useState(null);
  const { block, blockLoading, blockError } = useBlockDetails(normalizedBlockId, 10);
  const pageError = blockError ? getBlockErrorCopy(blockError) : null;
  useDocumentTitle('WalletLens · Block');

  useEffect(() => {
    if (!routeBlockId || routeBlockId === normalizedBlockId) {
      return;
    }

    navigate(getBlockRoute(normalizedBlockId), { replace: true });
  }, [navigate, normalizedBlockId, routeBlockId]);

  useEffect(() => {
    setSearchMessage(null);
  }, [normalizedBlockId]);

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
              <Badge variant="subtle">Block Page</Badge>
              <Badge variant="subtle">Internal routing</Badge>
            </div>

            <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.02] tracking-[-0.06em] text-slate-50 sm:text-[3.55rem]">
              Inspect a Bitcoin block without leaving WalletLens
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Review block metadata, chain context, and a preview of confirmed transactions from a dedicated internal explorer page.
            </p>

            <motion.div initial="hidden" animate="visible" variants={softStagger} className="mt-8 space-y-4">
              <motion.div variants={listItemReveal}>
                <Card className="p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Requested block</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <p className="break-all font-mono text-sm leading-7 text-slate-100">
                      {block?.hash ?? normalizedBlockId}
                    </p>
                    {block?.hash ? (
                      <CopyButton value={block.hash} label="Copy block hash" compact />
                    ) : null}
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {block?.height != null ? (
                      <Badge variant="accent">Height {formatNumber(block.height)}</Badge>
                    ) : null}
                    {block?.confirmations != null ? (
                      <Badge variant={block.inBestChain ? 'success' : 'warning'}>
                        {block.confirmations} confirmations
                      </Badge>
                    ) : null}
                    {block?.txCount != null ? (
                      <Badge variant="subtle">{formatNumber(block.txCount)} transactions</Badge>
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
            isLoading={blockLoading}
            validationError={searchMessage?.title ?? ''}
            sectionLabel="Universal Search"
            title="Open another wallet or transaction"
            description="Search by Bech32 testnet address or paste a 64-character txid to navigate directly."
          />
        </motion.section>

        {pageError && !block && !blockLoading ? (
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

        {blockLoading && !block ? (
          <section className="mt-8">
            <BlockPageSkeleton />
          </section>
        ) : null}

        {!blockLoading && block ? (
          <motion.section initial="hidden" animate="visible" variants={softStagger} className="mt-8 space-y-6">
            <motion.div variants={fadeUp}>
              <Card className="p-6 lg:p-7">
                <div className="flex flex-col gap-4 border-b border-white/6 pb-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Block Overview</p>
                    <h2 className="mt-2 font-display text-[2rem] tracking-[-0.04em] text-slate-50">
                      Chain placement and execution footprint
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-slate-400">
                      Review chain position, sizing, confirmation depth, and the first transactions included in this block.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={block.inBestChain ? 'success' : 'warning'}>
                      {block.inBestChain ? 'Best chain' : 'Not in best chain'}
                    </Badge>
                    <Badge variant="accent">Height {formatNumber(block.height)}</Badge>
                    <Badge variant="subtle">{formatNumber(block.txCount)} txs</Badge>
                  </div>
                </div>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={softStagger}
                  className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                >
                  <MetricCard
                    label="Confirmations"
                    value={String(block.confirmations ?? 'n/a')}
                    helper={block.inBestChain ? 'Confirmed in the current best chain' : 'Block is not on the best chain'}
                    icon={Blocks}
                  />
                  <MetricCard
                    label="Timestamp"
                    value={formatTimestampWithRelative(block.timestamp)}
                    helper={formatDateTime(block.timestamp)}
                    icon={Clock3}
                  />
                  <MetricCard
                    label="Transactions"
                    value={formatNumber(block.txCount)}
                    helper="Confirmed transactions in this block"
                    icon={Layers3}
                  />
                  <MetricCard
                    label="Block Size"
                    value={formatBytes(block.size)}
                    helper={`${formatNumber(block.size)} bytes`}
                    icon={Scale}
                  />
                  <MetricCard
                    label="Weight"
                    value={`${formatNumber(block.weight)} wu`}
                    helper={`Merkle root ${block.merkleRoot ? 'available' : 'unavailable'}`}
                    icon={Scale}
                  />
                  <MetricCard
                    label="Version"
                    value={String(block.version ?? 'n/a')}
                    helper={`Bits ${block.bits ?? 'n/a'} • Nonce ${block.nonce ?? 'n/a'}`}
                    icon={Blocks}
                  />
                </motion.div>
              </Card>
            </motion.div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
              <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="p-6 lg:p-7">
                  <div className="flex items-center justify-between gap-3 border-b border-white/6 pb-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Transactions Preview</p>
                      <h2 className="mt-2 font-display text-[2rem] tracking-[-0.04em] text-slate-50">
                        Confirmed transactions
                      </h2>
                    </div>
                    <Badge variant="accent">
                      {Math.min(block.transactionsPreview.length, 10)} of {formatNumber(block.txCount)}
                    </Badge>
                  </div>

                  {block.transactionsPreview.length === 0 ? (
                    <div className="pt-6">
                      <EmptyState
                        title="No preview transactions available"
                        description="WalletLens could not load a transaction preview for this block from Esplora."
                      />
                    </div>
                  ) : (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      variants={softStagger}
                      className="mt-5 space-y-2.5"
                    >
                      {block.transactionsPreview.map((transaction) => (
                        <BlockTransactionRow
                          key={transaction.txid}
                          transaction={transaction}
                          blockTimestamp={block.timestamp}
                        />
                      ))}
                    </motion.div>
                  )}
                </Card>
              </motion.div>

              <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                <Card className="p-6 lg:p-7">
                  <div className="flex items-center justify-between gap-3 border-b border-white/6 pb-5">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Block Internals</p>
                      <h2 className="mt-2 font-display text-[2rem] tracking-[-0.04em] text-slate-50">
                        Chain context
                      </h2>
                    </div>
                    <Badge variant="subtle">Metadata</Badge>
                  </div>

                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={softStagger}
                    className="mt-5 space-y-3"
                  >
                    <ChainLinkCard
                      label="Previous Block"
                      blockHash={block.previousBlockHash}
                      helper="Trace the parent block directly in WalletLens."
                    />
                    <ChainLinkCard
                      label="Next Block"
                      blockHash={block.nextBlockHash}
                      helper="Available when Esplora reports the next best chain block."
                    />

                    <motion.div
                      variants={listItemReveal}
                      whileHover={hoverLift}
                      className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                    >
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Block Hash</p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <p className="break-all font-mono text-xs leading-6 text-slate-100">{block.hash}</p>
                        <CopyButton value={block.hash} label="Copy block hash" compact />
                      </div>
                    </motion.div>

                    <motion.div
                      variants={listItemReveal}
                      whileHover={hoverLift}
                      className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                    >
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Merkle Root</p>
                      {block.merkleRoot ? (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <p className="break-all font-mono text-xs leading-6 text-slate-100">
                            {block.merkleRoot}
                          </p>
                          <CopyButton value={block.merkleRoot} label="Copy merkle root" compact />
                        </div>
                      ) : (
                        <p className="mt-3 text-sm text-slate-500">Unavailable</p>
                      )}
                    </motion.div>

                    <motion.div
                      variants={listItemReveal}
                      whileHover={hoverLift}
                      className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
                    >
                      <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Execution Details</p>
                      <div className="mt-3 grid gap-3 text-sm text-slate-300">
                        <p>Median time: {block.mediantime ? formatDateTime(block.mediantime) : 'n/a'}</p>
                        <p>Difficulty: {block.difficulty ?? 'n/a'}</p>
                        <p>Bits: {block.bits ?? 'n/a'}</p>
                        <p>Nonce: {block.nonce ?? 'n/a'}</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </Card>
              </motion.div>
            </div>
          </motion.section>
        ) : null}

        {!blockLoading && !block && !pageError ? (
          <section className="mt-8">
            <Loader label="Loading block..." />
          </section>
        ) : null}
      </main>
    </div>
  );
}

export default BlockPage;
