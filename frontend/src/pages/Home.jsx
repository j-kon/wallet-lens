import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle, DatabaseZap, Radio, Sparkles } from 'lucide-react';
import AddressSearch from '../components/AddressSearch';
import AddressMetadataPanel from '../components/AddressMetadataPanel';
import FeeEstimatesPanel from '../components/FeeEstimatesPanel';
import LatestBlocksPanel from '../components/LatestBlocksPanel';
import MempoolOverviewPanel from '../components/MempoolOverviewPanel';
import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import TransactionDetailsModal from '../components/TransactionDetailsModal';
import TransactionList from '../components/TransactionList';
import UtxoPanel from '../components/UtxoPanel';
import Badge from '../components/UI/Badge';
import Card from '../components/UI/Card';
import CopyButton from '../components/UI/CopyButton';
import EmptyState from '../components/UI/EmptyState';
import { Skeleton } from '../components/UI/Loader';
import { useAddressData } from '../hooks/useAddressData';
import { useBlocks } from '../hooks/useBlocks';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useFeeEstimates } from '../hooks/useFeeEstimates';
import { useMempoolData } from '../hooks/useMempoolData';
import { useTxDetails } from '../hooks/useTxDetails';
import { getAddressRoute, getHomeRoute, getTransactionRoute } from '../utils/explorerLinks';
import { fadeUp, getReveal, hoverLift, listItemReveal, softStagger } from '../utils/motion';
import { detectSearchTarget, normalizeSearchInput } from '../utils/searchTarget';

function getUniversalSearchMessage() {
  return {
    tone: 'error',
    title: 'Enter a testnet address or transaction id',
    description: 'Use a Bech32 testnet address beginning with tb1 or a 64-character transaction id.',
  };
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="p-5">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="mt-5 h-10 w-40" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-2/3" />
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
        <Card className="p-6">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="mt-3 h-4 w-72" />
          <div className="mt-6 space-y-3">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-40 w-full rounded-[24px]" />
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="mt-3 h-4 w-40" />
          <div className="mt-6 space-y-3">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-[24px]" />
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const { address: routedAddressParam } = useParams();
  const routedAddress = normalizeSearchInput(routedAddressParam ?? '');
  const [localSearchMessage, setLocalSearchMessage] = useState(null);

  const {
    query,
    setQuery,
    wallet,
    requestedAddress,
    loading,
    loadingMoreTransactions,
    hasSearched,
    message,
    hasMoreTransactions,
    searchAddress,
    loadMoreTransactions,
    clearSearch,
    demoAddress,
  } = useAddressData({ restoreOnMount: !routedAddress });
  const {
    selectedTransaction,
    selectedTransactionId,
    transactionDetails,
    detailsLoading,
    detailsError,
    openTransaction,
    closeTransaction,
  } = useTxDetails(routedAddress || wallet?.address || null);
  const { feeBands, feeEstimatesLoading, feeEstimatesError } = useFeeEstimates();
  const { mempool, mempoolLoading, mempoolError } = useMempoolData();
  const { blocks, blocksLoading, blocksError } = useBlocks(5);
  useDocumentTitle(routedAddress ? 'WalletLens · Address' : 'WalletLens');

  const activeWallet = routedAddress
    ? wallet?.address === routedAddress
      ? wallet
      : null
    : wallet;
  const isDashboardLoading = loading && !activeWallet;

  useEffect(() => {
    if (!routedAddressParam || !routedAddress || routedAddressParam === routedAddress) {
      return;
    }

    navigate(getAddressRoute(routedAddress), { replace: true });
  }, [navigate, routedAddress, routedAddressParam]);

  useEffect(() => {
    if (routedAddress || !wallet?.address) {
      return;
    }

    navigate(getAddressRoute(wallet.address), { replace: true });
  }, [navigate, routedAddress, wallet?.address]);

  useEffect(() => {
    if (!routedAddress || routedAddress === requestedAddress) {
      return;
    }

    setQuery(routedAddress);
    setLocalSearchMessage(null);
    searchAddress(routedAddress, { immediate: true });
  }, [requestedAddress, routedAddress, searchAddress, setQuery]);

  const handleSearch = (event) => {
    event.preventDefault();

    const target = detectSearchTarget(query);

    if (target.type === 'address') {
      setLocalSearchMessage(null);
      setQuery(target.value);

      if (target.value === routedAddress && target.value === requestedAddress) {
        searchAddress(target.value, { immediate: true });
        return;
      }

      navigate(getAddressRoute(target.value));
      return;
    }

    if (target.type === 'txid') {
      setLocalSearchMessage(null);
      navigate(getTransactionRoute(target.value));
      return;
    }

    setLocalSearchMessage(getUniversalSearchMessage());
  };

  const handleUseDemo = () => {
    setLocalSearchMessage(null);
    setQuery(demoAddress);

    if (demoAddress === routedAddress && demoAddress === requestedAddress) {
      searchAddress(demoAddress, { immediate: true });
      return;
    }

    navigate(getAddressRoute(demoAddress));
  };

  const handleClear = () => {
    setLocalSearchMessage(null);
    clearSearch();
    navigate(getHomeRoute());
  };

  const displayMessage = localSearchMessage ?? message;
  const validationError =
    localSearchMessage?.title ?? (message?.tone === 'error' ? message.title : '');
  const messageTone =
    message?.tone === 'error'
      ? 'border-rose-400/15 bg-rose-400/10 text-rose-100'
      : 'border-brand-sky/15 bg-brand-sky/10 text-brand-sky';

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
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="testnet">Testnet Explorer</Badge>
              <Badge variant="subtle">Universal Search</Badge>
              <Badge variant="subtle">Esplora API</Badge>
            </div>

            <h1 className="mt-6 max-w-3xl font-display text-4xl leading-[1.02] tracking-[-0.06em] text-slate-50 sm:text-[3.55rem]">
              Explore your Bitcoin wallet activity
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Inspect address balances, mempool activity, UTXOs, and full transaction details from a clean Bitcoin testnet dashboard.
            </p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={softStagger}
              className="mt-10 grid gap-4 sm:grid-cols-3"
            >
              <motion.div variants={listItemReveal} whileHover={hoverLift}>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-[20px] border border-white/10 bg-white/[0.05] p-3 text-brand-amber shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <Radio className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Live Feeds</p>
                      <p className="mt-1 text-sm leading-6 text-slate-200">Address, tx, mempool, and UTXO endpoints aligned to testnet.</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
              <motion.div variants={listItemReveal} whileHover={hoverLift}>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-[20px] border border-white/10 bg-white/[0.05] p-3 text-brand-sky shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <DatabaseZap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Wallet Context</p>
                      <p className="mt-1 text-sm leading-6 text-slate-200">Trace spendable outputs, metadata, and pending activity the way wallet tooling needs them.</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
              <motion.div variants={listItemReveal} whileHover={hoverLift}>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-[20px] border border-white/10 bg-white/[0.05] p-3 text-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Drilldown Ready</p>
                      <p className="mt-1 text-sm leading-6 text-slate-200">Jump from wallet timeline to full transaction inspection without leaving the explorer.</p>
                    </div>
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
            isLoading={loading}
            validationError={validationError}
            sectionLabel="Universal Search"
          />
        </motion.section>

        {message && activeWallet ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={getReveal({ y: 14, duration: 0.42 })}
            className={`mt-8 rounded-[26px] border px-5 py-4 text-sm ${messageTone}`}
          >
            <p className="font-medium">{message.title}</p>
            <p className="mt-2 opacity-90">{message.description}</p>
          </motion.div>
        ) : null}

        {activeWallet ? (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="mt-6 p-4 lg:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Active Dataset</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <p className="break-all font-mono text-sm leading-7 text-slate-100">
                      {activeWallet.address}
                    </p>
                    <CopyButton value={activeWallet.address} label="Copy address" compact />
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Live address snapshot from Blockstream Esplora testnet, including chain and mempool activity.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="testnet">{activeWallet.network}</Badge>
                  <Badge variant="success">Live data</Badge>
                  {activeWallet.pendingTransactions?.length ? (
                    <Badge variant="warning">{activeWallet.pendingTransactions.length} mempool</Badge>
                  ) : null}
                  {requestedAddress === demoAddress ? <Badge variant="accent">Demo address</Badge> : null}
                  <Link
                    to={getAddressRoute(activeWallet.address)}
                    className="inline-flex items-center gap-2 rounded-[20px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white"
                  >
                    Address page
                  </Link>
                  <Badge variant="subtle">
                    Updated{' '}
                    {new Intl.DateTimeFormat('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(activeWallet.lastUpdatedAt))}
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : null}

        {displayMessage?.tone === 'error' && !activeWallet ? (
          <div className="mt-8">
            <EmptyState
              icon={AlertTriangle}
              title={displayMessage.title}
              description={displayMessage.description}
              action={
                <button
                  type="button"
                  onClick={handleUseDemo}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-white/[0.08]"
                >
                  Try demo address
                </button>
              }
            />
          </div>
        ) : null}

        <section className="mt-6">
          {isDashboardLoading ? (
            <DashboardSkeleton />
          ) : activeWallet ? (
            <motion.div initial="hidden" animate="visible" variants={softStagger} className="space-y-4">
              <SummaryCards summary={activeWallet.summary} />
              <AddressMetadataPanel address={activeWallet.address} metadata={activeWallet.metadata} />
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_340px]">
                <TransactionList
                  transactions={activeWallet.transactions}
                  pendingTransactions={activeWallet.pendingTransactions}
                  feeBands={feeBands}
                  loading={loading}
                  loadingMoreTransactions={loadingMoreTransactions}
                  hasMoreTransactions={hasMoreTransactions}
                  onLoadMoreTransactions={loadMoreTransactions}
                  netFlow={activeWallet.netFlow}
                  selectedTransactionId={selectedTransactionId}
                  onSelectTransaction={openTransaction}
                />
                <UtxoPanel utxos={activeWallet.utxos} />
              </div>
            </motion.div>
          ) : (
            <EmptyState
              title={hasSearched ? 'No wallet loaded' : 'Start with a testnet address or txid'}
              description={
                hasSearched
                  ? 'Try another Bech32 testnet address, paste a 64-character transaction id, or load the demo address to inspect real explorer output.'
                  : 'Enter a Bech32 testnet address to inspect wallet state, or paste a transaction id to open a dedicated transaction page.'
              }
              action={
                <button
                  type="button"
                  onClick={handleUseDemo}
                  className="rounded-[20px] border border-brand-amber/20 bg-brand-amber/10 px-4 py-3 text-sm font-medium text-brand-amber transition hover:-translate-y-0.5 hover:bg-brand-amber/15"
                >
                  Try demo address
                </button>
              }
            />
          )}
        </section>

        <section className={activeWallet ? 'mt-5' : 'mt-8'}>
          <motion.div initial="hidden" animate="visible" variants={softStagger} className="space-y-4">
            <motion.div variants={getReveal({ y: 16, duration: 0.42 })}>
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Network Intelligence</p>
                  <h2 className="mt-2 font-display text-[2rem] tracking-[-0.05em] text-slate-50">
                    Testnet network telemetry
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Keep the wallet view grounded in current network conditions with live fee guidance, mempool pressure, and the latest blocks.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="subtle">Live fee bands</Badge>
                  <Badge variant="subtle">Mempool snapshot</Badge>
                  <Badge variant="subtle">Recent blocks</Badge>
                </div>
              </div>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1fr)_minmax(0,1.18fr)] xl:items-start">
              <FeeEstimatesPanel
                feeBands={feeBands}
                loading={feeEstimatesLoading}
                error={feeEstimatesError}
              />
              <MempoolOverviewPanel
                mempool={mempool}
                loading={mempoolLoading}
                error={mempoolError}
              />
              <div className="md:col-span-2 xl:col-span-1 xl:self-start">
                <LatestBlocksPanel
                  blocks={blocks}
                  loading={blocksLoading}
                  error={blocksError}
                />
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <TransactionDetailsModal
        isOpen={Boolean(selectedTransaction)}
        transaction={selectedTransaction}
        details={transactionDetails}
        address={activeWallet?.address}
        isLoading={detailsLoading}
        error={detailsError}
        onClose={closeTransaction}
      />
    </div>
  );
}

export default Home;
