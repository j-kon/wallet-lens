const shortFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const fullFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

export function formatDate(timestamp) {
  if (!timestamp) {
    return 'Awaiting confirmation';
  }

  return shortFormatter.format(new Date(timestamp * 1000));
}

export function formatDateTime(timestamp) {
  if (!timestamp) {
    return 'Pending in mempool';
  }

  return fullFormatter.format(new Date(timestamp * 1000));
}
