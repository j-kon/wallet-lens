import { useCallback, useEffect, useRef, useState } from 'react';
import {
  deriveWalletInsights,
  fetchAddressTransactionsPage,
  fetchWalletSnapshot,
  validateTestnetAddress,
} from '../services/bitcoinApi';
import { DEMO_TESTNET_ADDRESS } from '../services/demoAddress';
import {
  clearPersistedAddress,
  getPersistedAddress,
  persistAddress,
} from '../utils/persistedAddress';

function getInvalidAddressMessage() {
  return {
    tone: 'error',
    title: 'Invalid testnet address',
    description: 'WalletLens currently supports Bech32 testnet addresses beginning with tb1.',
  };
}

function getNoTransactionsMessage() {
  return {
    tone: 'info',
    title: 'No transaction history found',
    description: 'This address is valid, but Blockstream does not report any transaction history yet.',
  };
}

function getNetworkErrorMessage() {
  return {
    tone: 'error',
    title: 'Network error',
    description: 'Unable to fetch data from network. Check your connection and try again.',
  };
}

function mergeTransactions(existingTransactions, nextTransactions) {
  const seenTransactionIds = new Set();

  return [...existingTransactions, ...nextTransactions].filter((transaction) => {
    if (seenTransactionIds.has(transaction.txid)) {
      return false;
    }

    seenTransactionIds.add(transaction.txid);
    return true;
  });
}

export function useAddressData({ restoreOnMount = true } = {}) {
  const [query, setQuery] = useState('');
  const [wallet, setWallet] = useState(null);
  const [requestedAddress, setRequestedAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMoreTransactions, setLoadingMoreTransactions] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [message, setMessage] = useState(null);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(false);

  const addressAbortRef = useRef(null);
  const paginationAbortRef = useRef(null);
  const searchDebounceRef = useRef(null);
  const restoredOnceRef = useRef(false);

  const clearSearch = useCallback(() => {
    window.clearTimeout(searchDebounceRef.current);
    addressAbortRef.current?.abort();
    paginationAbortRef.current?.abort();
    clearPersistedAddress();

    setQuery('');
    setWallet(null);
    setRequestedAddress('');
    setLoading(false);
    setLoadingMoreTransactions(false);
    setHasMoreTransactions(false);
    setHasSearched(false);
    setMessage(null);
  }, []);

  const runSearch = useCallback(async (candidateAddress) => {
    const trimmedAddress = candidateAddress.trim().toLowerCase();

    addressAbortRef.current?.abort();
    paginationAbortRef.current?.abort();
    setHasSearched(true);
    setRequestedAddress(trimmedAddress);
    setMessage(null);
    setLoadingMoreTransactions(false);
    setHasMoreTransactions(false);
    setLoading(false);
    setWallet((currentWallet) => (
      currentWallet?.address === trimmedAddress ? currentWallet : null
    ));

    if (!trimmedAddress || !validateTestnetAddress(trimmedAddress)) {
      setWallet(null);
      setHasMoreTransactions(false);
      setMessage(getInvalidAddressMessage());
      return;
    }

    const controller = new AbortController();
    addressAbortRef.current = controller;
    setLoading(true);

    try {
      const liveWallet = await fetchWalletSnapshot(trimmedAddress, controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      persistAddress(trimmedAddress);
      setQuery(trimmedAddress);
      setWallet(liveWallet);
      setHasMoreTransactions(liveWallet.pagination.hasMoreTransactions);
      setMessage(
        (liveWallet.transactions ?? []).length === 0 &&
        (liveWallet.pendingTransactions ?? []).length === 0
          ? getNoTransactionsMessage()
          : null,
      );
    } catch (requestError) {
      if (controller.signal.aborted) {
        return;
      }

      setWallet(null);
      setHasMoreTransactions(false);

      if (requestError?.status === 400 || requestError?.status === 404) {
        clearPersistedAddress();
        setMessage(getInvalidAddressMessage());
        return;
      }

      setMessage(getNetworkErrorMessage());
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  const searchAddress = useCallback(
    (candidateAddress = query, { immediate = false } = {}) => {
      const valueToSearch = candidateAddress.trim().toLowerCase();

      window.clearTimeout(searchDebounceRef.current);

      if (immediate) {
        runSearch(valueToSearch);
        return;
      }

      searchDebounceRef.current = window.setTimeout(() => {
        runSearch(valueToSearch);
      }, 250);
    },
    [query, runSearch],
  );

  const loadMoreTransactions = useCallback(async () => {
    if (
      !wallet?.pagination?.lastSeenTxid ||
      !hasMoreTransactions ||
      loadingMoreTransactions
    ) {
      return;
    }

    paginationAbortRef.current?.abort();
    const controller = new AbortController();
    paginationAbortRef.current = controller;
    setLoadingMoreTransactions(true);

    try {
      const nextPage = await fetchAddressTransactionsPage(
        wallet.address,
        wallet.pagination.lastSeenTxid,
        controller.signal,
      );

      if (controller.signal.aborted) {
        return;
      }

      const mergedTransactions = mergeTransactions(wallet.transactions, nextPage.transactions);
      const insights = deriveWalletInsights(
        wallet.address,
        mergedTransactions,
        wallet.utxos,
        wallet.pendingTransactions,
      );

      setWallet((currentWallet) => ({
        ...currentWallet,
        transactions: mergedTransactions,
        metadata: insights.metadata,
        netFlow: insights.netFlow,
        pagination: {
          lastSeenTxid: nextPage.pagination.lastSeenTxid ?? currentWallet.pagination.lastSeenTxid,
          hasMoreTransactions: nextPage.pagination.hasMoreTransactions,
        },
        utxos: insights.utxos,
      }));
      setHasMoreTransactions(nextPage.pagination.hasMoreTransactions);
    } catch (error) {
      if (controller.signal.aborted) {
        return;
      }

      setMessage(getNetworkErrorMessage());
    } finally {
      if (!controller.signal.aborted) {
        setLoadingMoreTransactions(false);
      }
    }
  }, [hasMoreTransactions, loadingMoreTransactions, wallet]);

  useEffect(() => {
    if (restoredOnceRef.current || !restoreOnMount) {
      return;
    }

    restoredOnceRef.current = true;
    const persistedAddress = getPersistedAddress();

    if (!persistedAddress) {
      return;
    }

    if (!validateTestnetAddress(persistedAddress)) {
      clearPersistedAddress();
      return;
    }

    setQuery(persistedAddress);
    searchAddress(persistedAddress, { immediate: true });
  }, [restoreOnMount, searchAddress]);

  useEffect(
    () => () => {
      window.clearTimeout(searchDebounceRef.current);
      addressAbortRef.current?.abort();
      paginationAbortRef.current?.abort();
    },
    [],
  );

  return {
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
    demoAddress: DEMO_TESTNET_ADDRESS,
  };
}
