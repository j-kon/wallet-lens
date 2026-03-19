import { useCallback, useEffect, useRef, useState } from 'react';
import {
  fetchTransactionDetail,
  fetchTransactionHex,
  validateTransactionId,
} from '../services/bitcoinApi';

const transactionDetailCache = new Map();
const transactionHexCache = new Map();

function getCacheKey(txid, address) {
  return `${address ?? 'global'}:${txid}`;
}

export function useTxDetails(address) {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactionHex, setTransactionHex] = useState('');
  const [hexLoading, setHexLoading] = useState(false);
  const [hexError, setHexError] = useState('');

  const abortRef = useRef(null);
  const hexAbortRef = useRef(null);

  const closeTransaction = useCallback(() => {
    abortRef.current?.abort();
    hexAbortRef.current?.abort();
    setSelectedTransaction(null);
    setTransactionDetails(null);
    setLoading(false);
    setError('');
    setTransactionHex('');
    setHexLoading(false);
    setHexError('');
  }, []);

  const loadTransactionById = useCallback(
    async (txid, { previewTransaction = null, addressOverride } = {}) => {
      const resolvedTxid = txid?.trim().toLowerCase() ?? '';
      const resolvedAddress = addressOverride ?? address ?? null;

      abortRef.current?.abort();
      setSelectedTransaction(previewTransaction ?? (resolvedTxid ? { txid: resolvedTxid } : null));
      setTransactionDetails(previewTransaction);
      setLoading(false);
      setError('');
      setTransactionHex('');
      setHexError('');
      setHexLoading(false);

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

  const loadTransactionHexById = useCallback(async (txid) => {
    const resolvedTxid = txid?.trim().toLowerCase() ?? '';
    hexAbortRef.current?.abort();
    setHexLoading(false);
    setHexError('');

    if (!resolvedTxid || !validateTransactionId(resolvedTxid)) {
      setHexLoading(false);
      setHexError('Raw hex unavailable');
      return;
    }

    const cachedHex = transactionHexCache.get(resolvedTxid);

    if (cachedHex) {
      setTransactionHex(cachedHex);
      return;
    }

    const controller = new AbortController();
    hexAbortRef.current = controller;
    setHexLoading(true);

    try {
      const hex = await fetchTransactionHex(resolvedTxid, controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      transactionHexCache.set(resolvedTxid, hex);
      setTransactionHex(hex);
    } catch (requestError) {
      if (controller.signal.aborted) {
        return;
      }

      setHexError(requestError?.kind === 'network' ? 'Unable to fetch raw hex' : 'Raw hex unavailable');
    } finally {
      if (!controller.signal.aborted) {
        setHexLoading(false);
      }
    }
  }, []);

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
      hexAbortRef.current?.abort();
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
    transactionHex,
    hexLoading,
    hexError,
    loadTransactionHexById,
    closeTransaction,
  };
}
