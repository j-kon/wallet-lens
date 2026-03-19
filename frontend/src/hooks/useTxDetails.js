import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTransactionDetail } from '../services/bitcoinApi';

export function useTxDetails(address) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const cacheRef = useRef(new Map());
  const abortRef = useRef(null);

  const closeTransaction = useCallback(() => {
    abortRef.current?.abort();
    setSelectedTransaction(null);
    setTransactionDetails(null);
    setLoading(false);
    setError('');
  }, []);

  const openTransaction = useCallback(
    async (transaction) => {
      setSelectedTransaction(transaction);
      setTransactionDetails(transaction);
      setError('');

      if (!address) {
        return;
      }

      const cachedDetail = cacheRef.current.get(transaction.txid);

      if (cachedDetail) {
        setTransactionDetails(cachedDetail);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);

      try {
        const detail = await fetchTransactionDetail(transaction.txid, controller.signal, address);

        if (controller.signal.aborted) {
          return;
        }

        cacheRef.current.set(transaction.txid, detail);
        setTransactionDetails(detail);
      } catch (detailError) {
        if (controller.signal.aborted) {
          return;
        }

        setError('Unable to fetch data from network');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [address],
  );

  useEffect(() => {
    cacheRef.current.clear();
    closeTransaction();
  }, [address, closeTransaction]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
    },
    [],
  );

  return {
    selectedTransaction,
    selectedTransactionId: selectedTransaction?.txid ?? null,
    transactionDetails,
    detailsLoading: loading,
    detailsError: error,
    openTransaction,
    closeTransaction,
  };
}
