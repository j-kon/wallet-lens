const EXPLORER_BASE_URL = 'https://blockstream.info/testnet';

export function getAddressRoute(address) {
  return `/address/${address}`;
}

export function getTransactionRoute(txid) {
  return `/tx/${txid}`;
}

export function getBlockRoute(blockId) {
  return `/block/${blockId}`;
}

export function getAddressExplorerUrl(address) {
  return `${EXPLORER_BASE_URL}/address/${address}`;
}

export function getTransactionExplorerUrl(txid) {
  return `${EXPLORER_BASE_URL}/tx/${txid}`;
}

export function getBlockExplorerUrl(blockHash) {
  return `${EXPLORER_BASE_URL}/block/${blockHash}`;
}
