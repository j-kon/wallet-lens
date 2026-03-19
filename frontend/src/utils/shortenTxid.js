export function shortenTxid(txid, start = 10, end = 8) {
  if (!txid) {
    return 'unknown';
  }

  if (txid.length <= start + end + 3) {
    return txid;
  }

  return `${txid.slice(0, start)}...${txid.slice(-end)}`;
}
