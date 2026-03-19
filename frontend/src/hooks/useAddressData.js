import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchWalletSnapshot, validateTestnetAddress } from '../services/bitcoinApi';
import { DEMO_TESTNET_ADDRESS } from '../services/demoAddress';

export function useAddressData() {
  const [wallet, setWallet] = useState(null);
  const [requestedAddress, setRequestedAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [message, setMessage] = useState(null);

  const addressAbortRef = useRef(null);

  const searchAddress = useCallback(
    async (candidateAddress) => {
      const trimmedAddress = candidateAddress.trim().toLowerCase();

      addressAbortRef.current?.abort();
      setHasSearched(true);
      setRequestedAddress(trimmedAddress);
      setMessage(null);

      if (!trimmedAddress) {
        setWallet(null);
        setMessage({
          tone: 'error',
          title: 'Invalid testnet address',
          description: 'Enter a valid Bitcoin testnet address that starts with tb1.',
        });
        return;
      }

      if (!validateTestnetAddress(trimmedAddress)) {
        setWallet(null);
        setMessage({
          tone: 'error',
          title: 'Invalid testnet address',
          description: 'Enter a valid Bitcoin testnet address that starts with tb1.',
        });
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

        setWallet(liveWallet);

        if ((liveWallet.transactions ?? []).length === 0) {
          setMessage({
            tone: 'info',
            title: 'No transaction history found',
            description: 'This address has no transaction history yet',
          });
        }
      } catch (requestError) {
        if (controller.signal.aborted) {
          return;
        }

        setWallet(null);

        if (requestError?.status === 400 || requestError?.status === 404) {
          setMessage({
            tone: 'error',
            title: 'Invalid testnet address',
            description: 'Enter a valid Bitcoin testnet address that starts with tb1.',
          });
          return;
        }

        setMessage({
          tone: 'error',
          title: 'Network error',
          description: 'Unable to fetch data from network',
        });
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(
    () => () => {
      addressAbortRef.current?.abort();
    },
    [],
  );

  return {
    wallet,
    requestedAddress,
    loading,
    hasSearched,
    message,
    searchAddress,
    demoAddress: DEMO_TESTNET_ADDRESS,
  };
}
