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

export function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return 'Pending in mempool';
  }

  const diffInSeconds = Math.round(timestamp - Date.now() / 1000);
  const absoluteSeconds = Math.abs(diffInSeconds);

  const ranges = [
    { seconds: 60, unit: 'second' },
    { seconds: 60 * 60, unit: 'minute' },
    { seconds: 60 * 60 * 24, unit: 'hour' },
    { seconds: 60 * 60 * 24 * 7, unit: 'day' },
    { seconds: 60 * 60 * 24 * 30, unit: 'week' },
    { seconds: 60 * 60 * 24 * 365, unit: 'month' },
    { seconds: Number.POSITIVE_INFINITY, unit: 'year' },
  ];

  let unit = 'second';

  for (const range of ranges) {
    unit = range.unit;

    if (absoluteSeconds < range.seconds) {
      break;
    }
  }

  const value =
    unit === 'second'
      ? diffInSeconds
      : Math.round(diffInSeconds / (unit === 'minute'
          ? 60
          : unit === 'hour'
            ? 60 * 60
            : unit === 'day'
              ? 60 * 60 * 24
              : unit === 'week'
                ? 60 * 60 * 24 * 7
                : unit === 'month'
                  ? 60 * 60 * 24 * 30
                  : 60 * 60 * 24 * 365));

  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(value, unit);
}

export function formatTimestampWithRelative(timestamp) {
  if (!timestamp) {
    return 'Pending in mempool';
  }

  return `${formatRelativeTime(timestamp)} • ${formatDateTime(timestamp)}`;
}
