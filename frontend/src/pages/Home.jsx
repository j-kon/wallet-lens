import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, DatabaseZap, Radio, Sparkles } from 'lucide-react';
import AddressSearch from '../components/AddressSearch';
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
  const {
    wallet,
    requestedAddress,
    loading,
    hasSearched,
    message,
    searchAddress,
    demoAddress,
  } = useAddressData();
  const {
    selectedTransaction,
    selectedTransactionId,
    transactionDetails,
    detailsLoading,
    detailsError,
    openTransaction,
    closeTransaction,
  } = useTxDetails(wallet?.address);

  const [query, setQuery] = useState('');

  const handleSearch = (event) => {
    event.preventDefault();
    searchAddress(query);
  };

  const handleUseDemo = () => {
    setQuery(demoAddress);
    searchAddress(demoAddress);
  };

  const messageTone =
    message?.tone === 'error'
      ? 'border-rose-400/15 bg-rose-400/10 text-rose-100'
      : 'border-brand-sky/15 bg-brand-sky/10 text-brand-sky';

  return (
    <div className="min-h-screen text-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)] lg:items-start"
        >
          <div className="py-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="testnet">Testnet Explorer</Badge>
              <Badge variant="subtle">Developer Tooling</Badge>
              <Badge variant="subtle">Esplora API</Badge>
            </div>

            <h1 className="mt-6 max-w-3xl font-display text-4xl leading-tight tracking-tight text-slate-50 sm:text-5xl">
              Explore your Bitcoin wallet activity
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">
              Inspect balances, transactions, UTXOs, and fee details from a clean Bitcoin testnet dashboard.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-brand-amber">
                    <Radio className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Live Feeds</p>
                    <p className="mt-1 text-sm text-slate-200">Address, tx, and UTXO endpoints aligned to testnet.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-brand-sky">
                    <DatabaseZap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">UTXO Aware</p>
                    <p className="mt-1 text-sm text-slate-200">Trace spendable outputs the way wallet infrastructure needs them.</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-emerald-300">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Drilldown Ready</p>
                    <p className="mt-1 text-sm text-slate-200">Open full transaction inputs, outputs, confirmations, and fee data.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <AddressSearch
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            onUseDemo={handleUseDemo}
            isLoading={loading}
            validationError={message?.tone === 'error' ? message.title : ''}
          />
        </motion.section>

        {message && wallet ? (
          <div className={`mt-8 rounded-[24px] border px-5 py-4 text-sm ${messageTone}`}>
            <p className="font-medium">{message.title}</p>
            <p className="mt-2 opacity-90">{message.description}</p>
          </div>
        ) : null}

        {wallet ? (
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
                  Live response from Blockstream Esplora testnet.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="testnet">{wallet.network}</Badge>
                <Badge variant="success">Live data</Badge>
                {requestedAddress === demoAddress ? <Badge variant="accent">Demo address</Badge> : null}
                <Badge variant="subtle">
                  Updated {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(new Date(wallet.lastUpdatedAt))}
                </Badge>
              </div>
            </div>
          </Card>
        ) : null}

        {message?.tone === 'error' && !wallet ? (
          <div className="mt-8">
            <EmptyState
              icon={AlertTriangle}
              title={message.title}
              description={message.description}
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
            <div className="space-y-6">
              <SummaryCards summary={wallet.summary} />
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
                <TransactionList
                  transactions={wallet.transactions}
                  loading={loading}
                  selectedTransactionId={selectedTransactionId}
                  onSelectTransaction={openTransaction}
                />
                <UtxoPanel utxos={wallet.utxos} />
              </div>
            </div>
          ) : (
            <EmptyState
              title={hasSearched ? 'No wallet loaded' : 'Start with a Bitcoin testnet address'}
              description={
                hasSearched
                  ? 'Try another Bech32 testnet address or load the demo address to inspect real explorer output.'
                  : 'Enter an address to inspect balances, transactions, fee rates, and the UTXO set from the Esplora testnet API.'
              }
              action={
                <button
                  type="button"
                  onClick={handleUseDemo}
                  className="rounded-2xl border border-brand-amber/20 bg-brand-amber/10 px-4 py-3 text-sm font-medium text-brand-amber transition hover:bg-brand-amber/15"
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
