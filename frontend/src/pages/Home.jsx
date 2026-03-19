import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangle, DatabaseZap, ExternalLink, Radio, Sparkles } from 'lucide-react';
import AddressSearch from '../components/AddressSearch';
import AddressMetadataPanel from '../components/AddressMetadataPanel';
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
import { useTxDetails } from '../hooks/useTxDetails';
import { getAddressExplorerUrl } from '../utils/explorerLinks';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const routedAddress = normalizeSearchInput(searchParams.get('address') ?? '');
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
  } = useTxDetails(wallet?.address);

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

      setSearchParams({ address: target.value });
      return;
    }

    if (target.type === 'txid') {
      setLocalSearchMessage(null);
      navigate(`/tx/${target.value}`);
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

    setSearchParams({ address: demoAddress });
  };

  const handleClear = () => {
    setLocalSearchMessage(null);
    clearSearch();
    setSearchParams({});
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

        {message && wallet ? (
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

        {wallet ? (
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="mt-8 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Active Dataset</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <p className="break-all font-mono text-sm leading-7 text-slate-100">
                      {wallet.address}
                    </p>
                    <CopyButton value={wallet.address} label="Copy address" compact />
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    Live address snapshot from Blockstream Esplora testnet, including chain and mempool activity.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="testnet">{wallet.network}</Badge>
                  <Badge variant="success">Live data</Badge>
                  {wallet.pendingTransactions?.length ? (
                    <Badge variant="warning">{wallet.pendingTransactions.length} mempool</Badge>
                  ) : null}
                  {requestedAddress === demoAddress ? <Badge variant="accent">Demo address</Badge> : null}
                  <a
                    href={getAddressExplorerUrl(wallet.address)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-[20px] border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] transition hover:-translate-y-0.5 hover:bg-white/[0.08] hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4 text-brand-sky" />
                    Blockstream
                  </a>
                  <Badge variant="subtle">
                    Updated{' '}
                    {new Intl.DateTimeFormat('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    }).format(new Date(wallet.lastUpdatedAt))}
                  </Badge>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : null}

        {wallet ? (
          <div className="mt-6">
            <AddressMetadataPanel address={wallet.address} metadata={wallet.metadata} />
          </div>
        ) : null}

        {displayMessage?.tone === 'error' && !wallet ? (
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

        <section className="mt-8">
          {loading && !wallet ? (
            <DashboardSkeleton />
          ) : wallet ? (
            <motion.div initial="hidden" animate="visible" variants={softStagger} className="space-y-6">
              <SummaryCards summary={wallet.summary} />
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
                <TransactionList
                  transactions={wallet.transactions}
                  pendingTransactions={wallet.pendingTransactions}
                  loading={loading}
                  loadingMoreTransactions={loadingMoreTransactions}
                  hasMoreTransactions={hasMoreTransactions}
                  onLoadMoreTransactions={loadMoreTransactions}
                  netFlow={wallet.netFlow}
                  selectedTransactionId={selectedTransactionId}
                  onSelectTransaction={openTransaction}
                />
                <UtxoPanel utxos={wallet.utxos} />
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
      </main>

      <TransactionDetailsModal
        isOpen={Boolean(selectedTransaction)}
        transaction={selectedTransaction}
        details={transactionDetails}
        address={wallet?.address}
        isLoading={detailsLoading}
        error={detailsError}
        onClose={closeTransaction}
      />
    </div>
  );
}

export default Home;
