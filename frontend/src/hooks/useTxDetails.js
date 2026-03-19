import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchTransactionDetail, validateTransactionId } from '../services/bitcoinApi';

const transactionDetailCache = new Map();

function getCacheKey(txid, address) {
  return `${address ?? 'global'}:${txid}`;
}

export function useTxDetails(address) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const abortRef = useRef(null);

  const closeTransaction = useCallback(() => {
    abortRef.current?.abort();
    setSelectedTransaction(null);
    setTransactionDetails(null);
    setLoading(false);
    setError('');
  }, []);

  const loadTransactionById = useCallback(
    async (txid, { previewTransaction = null, addressOverride } = {}) => {
      const resolvedTxid = txid?.trim().toLowerCase() ?? '';
      const resolvedAddress = addressOverride ?? address ?? null;

      setSelectedTransaction(previewTransaction ?? (resolvedTxid ? { txid: resolvedTxid } : null));
      setTransactionDetails(previewTransaction);
      setError('');

      if (!resolvedTxid || !validateTransactionId(resolvedTxid)) {
        setLoading(false);
        setTransactionDetails(null);
        setError('Transaction not found');
        return;
      }

      const cacheKey = getCacheKey(resolvedTxid, resolvedAddress);
      const cachedDetail = transactionDetailCache.get(cacheKey);

      if (cachedDetail) {
        setTransactionDetails(cachedDetail);
        return;
      }

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);

      try {
        const detail = await fetchTransactionDetail(
          resolvedTxid,
          controller.signal,
          resolvedAddress,
        );

        if (controller.signal.aborted) {
          return;
        }

        transactionDetailCache.set(cacheKey, detail);
        setTransactionDetails(detail);
      } catch (detailError) {
        if (controller.signal.aborted) {
          return;
        }

        setTransactionDetails(null);

        if (detailError?.status === 400 || detailError?.status === 404) {
          setError('Transaction not found');
          return;
        }

        setError('Unable to fetch transaction');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [address],
  );

  const openTransaction = useCallback(
    async (transaction) => {
      await loadTransactionById(transaction?.txid, { previewTransaction: transaction });
    },
    [loadTransactionById],
  );

  useEffect(() => {
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
    loadTransactionById,
    closeTransaction,
  };
}
