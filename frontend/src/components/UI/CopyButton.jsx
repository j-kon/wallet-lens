import { useEffect, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../utils/cn';

function CopyButton({
  value,
  label = 'Copy value',
  className,
  compact = false,
  onClick,
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const handleCopy = async (event) => {
    onClick?.(event);

    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:bg-white/[0.08] hover:text-white',
        compact ? 'h-9 w-9' : 'px-3 py-2 text-sm',
        className,
      )}
      aria-label={label}
      title={label}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
      {compact ? null : <span>{copied ? 'Copied' : 'Copy'}</span>}
    </button>
  );
}

export default CopyButton;
