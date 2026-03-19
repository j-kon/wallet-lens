const TXID_REGEX = /^[a-f0-9]{64}$/i;

export function normalizeSearchInput(input = '') {
  return input.trim().toLowerCase();
}

export function validateTxid(txid = '') {
  return TXID_REGEX.test(normalizeSearchInput(txid));
}

export function detectSearchTarget(input = '') {
  const normalizedInput = normalizeSearchInput(input);

  if (!normalizedInput) {
    return {
      type: 'unknown',
      value: '',
    };
  }

  if (normalizedInput.startsWith('tb1')) {
    return {
      type: 'address',
      value: normalizedInput,
    };
  }

  if (validateTxid(normalizedInput)) {
    return {
      type: 'txid',
      value: normalizedInput,
    };
  }

  return {
    type: 'unknown',
    value: normalizedInput,
  };
}
