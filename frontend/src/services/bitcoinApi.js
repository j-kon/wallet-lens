const BASE_URL = 'https://blockstream.info/testnet/api';
const TESTNET_ADDRESS_REGEX =
  /^(tb1[qpzry9x8gf2tvdw0s3jn54khce6mua7l]{11,71}|[mn2][1-9A-HJ-NP-Za-km-z]{25,62})$/i;

function createApiError(message, status, path) {
  const error = new Error(message);
  error.status = status;
  error.path = path;
  return error;
}

async function request(path, { signal, responseType = 'json' } = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    signal,
    headers: {
      Accept: responseType === 'json' ? 'application/json' : 'text/plain',
    },
  });

  if (!response.ok) {
    throw createApiError(`Esplora request failed for ${path}.`, response.status, path);
  }

  if (responseType === 'text') {
    return response.text();
  }

  return response.json();
}

function calculateConfirmations(status, tipHeight) {
  if (!status?.confirmed || !status.block_height || !tipHeight) {
    return status?.confirmed ? null : 0;
  }

  return Math.max(tipHeight - status.block_height + 1, 1);
}

function getValueFlowForAddress(collection, address, pickValue) {
  if (!address) {
    return 0;
  }

  return collection.reduce((sum, entry) => {
    const entryAddress =
      entry?.scriptpubkey_address ??
      entry?.prevout?.scriptpubkey_address;

    if (entryAddress !== address) {
      return sum;
    }

    return sum + pickValue(entry);
  }, 0);
}

export function validateTestnetAddress(address) {
  return TESTNET_ADDRESS_REGEX.test(address.trim());
}

export function normalizeTransaction(tx, address, tipHeight) {
  const sentValue = getValueFlowForAddress(
    tx.vin ?? [],
    address,
    (entry) => entry?.prevout?.value ?? 0,
  );
  const receivedValue = getValueFlowForAddress(
    tx.vout ?? [],
    address,
    (entry) => entry?.value ?? 0,
  );
  const netValue = receivedValue - sentValue;
  const direction =
    netValue > 0 ? 'incoming' : netValue < 0 ? 'outgoing' : 'internal';
  const vsize = tx.vsize ?? (tx.weight ? Math.ceil(tx.weight / 4) : tx.size ?? null);
  const feeRate = tx.fee != null && vsize ? tx.fee / vsize : null;

  return {
    ...tx,
    vsize,
    feeRate,
    sentValue,
    receivedValue,
    netValue,
    direction,
    confirmations: calculateConfirmations(tx.status, tipHeight),
  };
}

function normalizeUtxo(utxo, tipHeight) {
  return {
    ...utxo,
    confirmations: calculateConfirmations(utxo.status, tipHeight),
  };
}

function normalizeWalletSnapshot(address, addressInfo, transactions, utxos, tipHeight) {
  const confirmedBalance =
    (addressInfo?.chain_stats?.funded_txo_sum ?? 0) -
    (addressInfo?.chain_stats?.spent_txo_sum ?? 0);
  const pendingBalance =
    (addressInfo?.mempool_stats?.funded_txo_sum ?? 0) -
    (addressInfo?.mempool_stats?.spent_txo_sum ?? 0);

  return {
    source: 'live',
    address,
    requestedAddress: address,
    network: 'Testnet',
    tipHeight,
    lastUpdatedAt: new Date().toISOString(),
    summary: {
      balance: confirmedBalance + pendingBalance,
      confirmedBalance,
      pendingBalance,
      totalReceived:
        (addressInfo?.chain_stats?.funded_txo_sum ?? 0) +
        (addressInfo?.mempool_stats?.funded_txo_sum ?? 0),
      totalSent:
        (addressInfo?.chain_stats?.spent_txo_sum ?? 0) +
        (addressInfo?.mempool_stats?.spent_txo_sum ?? 0),
      transactionCount:
        (addressInfo?.chain_stats?.tx_count ?? 0) +
        (addressInfo?.mempool_stats?.tx_count ?? 0),
      confirmedTransactions: addressInfo?.chain_stats?.tx_count ?? 0,
      pendingTransactions: addressInfo?.mempool_stats?.tx_count ?? 0,
    },
    transactions: (transactions ?? []).map((tx) =>
      normalizeTransaction(tx, address, tipHeight),
    ),
    utxos: (utxos ?? []).map((utxo) => normalizeUtxo(utxo, tipHeight)),
  };
}

export async function fetchWalletSnapshot(address, signal) {
  const [addressInfo, transactions, utxos, tipHeightText] = await Promise.all([
    request(`/address/${address}`, { signal }),
    request(`/address/${address}/txs`, { signal }),
    request(`/address/${address}/utxo`, { signal }),
    request('/blocks/tip/height', { signal, responseType: 'text' }).catch(() => null),
  ]);

  const tipHeight = tipHeightText ? Number(tipHeightText) : null;

  return normalizeWalletSnapshot(address, addressInfo, transactions, utxos, tipHeight);
}

export async function fetchTransactionDetail(txid, signal, address) {
  const [transaction, tipHeightText] = await Promise.all([
    request(`/tx/${txid}`, { signal }),
    request('/blocks/tip/height', { signal, responseType: 'text' }).catch(() => null),
  ]);

  return normalizeTransaction(transaction, address, tipHeightText ? Number(tipHeightText) : null);
}
