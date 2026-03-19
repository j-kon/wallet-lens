const SATS_IN_BTC = 100_000_000;

export function formatBTC(
  sats,
  { minimumFractionDigits = 0, maximumFractionDigits = 8, signed = false } = {},
) {
  const value = Number(sats ?? 0) / SATS_IN_BTC;
  const prefix = signed && value > 0 ? '+' : '';
  const resolvedMinimumDigits = Math.abs(value) < 1 ? Math.max(minimumFractionDigits, 4) : minimumFractionDigits;

  return `${prefix}${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: resolvedMinimumDigits,
    maximumFractionDigits,
  }).format(value)} BTC`;
}

export function formatSats(sats) {
  return `${new Intl.NumberFormat('en-US').format(Number(sats ?? 0))} sats`;
}

export function formatFeeRate(feeRate) {
  if (feeRate == null || Number.isNaN(feeRate)) {
    return 'n/a';
  }

  const decimals = feeRate >= 10 ? 1 : 2;
  return `${feeRate.toFixed(decimals)} sat/vB`;
}
