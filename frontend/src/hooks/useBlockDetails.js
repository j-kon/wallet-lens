import { useEffect, useState } from 'react';
import { fetchBlockDetail } from '../services/bitcoinApi';

const blockCache = new Map();

export function useBlockDetails(blockId, previewLimit = 10) {
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(Boolean(blockId));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!blockId) {
      setBlock(null);
      setLoading(false);
      setError('Block not found');
      return undefined;
    }

    const cacheKey = `${String(blockId).trim().toLowerCase()}:${previewLimit}`;
    const cachedBlock = blockCache.get(cacheKey);

    if (cachedBlock) {
      setBlock(cachedBlock);
      setLoading(false);
      setError('');
      return undefined;
    }

    const controller = new AbortController();
    setBlock(null);
    setLoading(true);
    setError('');

    fetchBlockDetail(blockId, controller.signal, previewLimit)
      .then((nextBlock) => {
        if (controller.signal.aborted) {
          return;
        }

        blockCache.set(cacheKey, nextBlock);
        setBlock(nextBlock);
      })
      .catch((requestError) => {
        if (controller.signal.aborted) {
          return;
        }

        setBlock(null);

        if (requestError?.status === 400 || requestError?.status === 404) {
          setError('Block not found');
          return;
        }

        setError('Unable to fetch block');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [blockId, previewLimit]);

  return {
    block,
    blockLoading: loading,
    blockError: error,
  };
}
