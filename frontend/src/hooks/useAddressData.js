import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTransactionDetail, fetchWalletSnapshot, validateTestnetAddress } from '../services/bitcoinApi';
import { getMockWalletSnapshot, SAMPLE_TESTNET_ADDRESS } from '../services/mockWalletData';

export function useAddressData() {
  const [wallet, setWallet] = useState(null);
  const [requestedAddress, setRequestedAddress] = useState(SAMPLE_TESTNET_ADDRESS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [usingMockData, setUsingMockData] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');

  const addressAbortRef = useRef(null);
  const detailsAbortRef = useRef(null);
  const detailsCacheRef = useRef(new Map());
  const initialSearchRef = useRef(false);
  const activeAddressRef = useRef(SAMPLE_TESTNET_ADDRESS);

  const closeTransaction = useCallback(() => {
    detailsAbortRef.current?.abort();
    setSelectedTransaction(null);
    setTransactionDetails(null);
    setDetailsLoading(false);
    setDetailsError('');
  }, []);

  const searchAddress = useCallback(
    async (candidateAddress) => {
      const trimmedAddress = candidateAddress.trim();

      setRequestedAddress(trimmedAddress);
      setError('');
      setNotice('');
      closeTransaction();

      if (!trimmedAddress) {
        setError('Enter a Bitcoin testnet address to inspect.');
        return;
      }

      if (!validateTestnetAddress(trimmedAddress)) {
        setError('Enter a valid Bitcoin testnet address. Supported prefixes: tb1, m, n, or 2.');
        return;
      }

      addressAbortRef.current?.abort();
      const controller = new AbortController();
      addressAbortRef.current = controller;

      setLoading(true);

      try {
        const liveWallet = await fetchWalletSnapshot(trimmedAddress, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        detailsCacheRef.current.clear();
        activeAddressRef.current = trimmedAddress;
        setWallet(liveWallet);
        setUsingMockData(false);
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        if (requestError?.status === 400 || requestError?.status === 404) {
          setWallet(null);
          setUsingMockData(false);
          setError('Blockstream Esplora could not resolve that testnet address.');
          return;
        }

        const fallbackWallet = getMockWalletSnapshot();
        detailsCacheRef.current.clear();
        activeAddressRef.current = fallbackWallet.address;
        setWallet({
          ...fallbackWallet,
          requestedAddress: trimmedAddress,
        });
        setUsingMockData(true);
        setNotice(
          'Live testnet data is temporarily unavailable, so WalletLens switched to a sample dataset.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [closeTransaction],
  );

  const openTransaction = useCallback(
    async (transaction) => {
      setSelectedTransaction(transaction);
      setTransactionDetails(transaction);
      setDetailsError('');

      if (usingMockData) {
        return;
      }

      const cachedDetail = detailsCacheRef.current.get(transaction.txid);

      if (cachedDetail) {
        setTransactionDetails(cachedDetail);
        return;
      }

      detailsAbortRef.current?.abort();
      const controller = new AbortController();
      detailsAbortRef.current = controller;

      setDetailsLoading(true);

      try {
        const detail = await fetchTransactionDetail(
          transaction.txid,
          controller.signal,
          activeAddressRef.current,
        );

        if (controller.signal.aborted) {
          return;
        }

        detailsCacheRef.current.set(transaction.txid, detail);
        setTransactionDetails(detail);
      } catch (detailError) {
        if (controller.signal.aborted) {
          return;
        }

        setDetailsError(
          'Live transaction detail could not be loaded. Showing the address-level payload instead.',
        );
      } finally {
        if (!controller.signal.aborted) {
          setDetailsLoading(false);
        }
      }
    },
    [usingMockData],
  );

  useEffect(() => {
    if (initialSearchRef.current) {
      return;
    }

    initialSearchRef.current = true;
    searchAddress(SAMPLE_TESTNET_ADDRESS);
  }, [searchAddress]);

  useEffect(
    () => () => {
      addressAbortRef.current?.abort();
      detailsAbortRef.current?.abort();
    },
    [],
  );

  return {
    wallet,
    requestedAddress,
    loading,
    error,
    notice,
    usingMockData,
    selectedTransaction,
    transactionDetails,
    detailsLoading,
    detailsError,
    searchAddress,
    openTransaction,
    closeTransaction,
    sampleAddress: SAMPLE_TESTNET_ADDRESS,
  };
}
