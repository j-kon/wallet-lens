import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../utils/cn';
import { MOTION_EASE } from '../../utils/motion';

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
    <motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1.5, scale: 1.02 }}
      animate={
        copied
          ? {
              scale: [1, 1.05, 1],
              y: [0, -1, 0],
              boxShadow: [
                '0 0 0 rgba(34,197,94,0)',
                '0 0 24px rgba(34,197,94,0.18)',
                '0 0 0 rgba(34,197,94,0)',
              ],
            }
          : { scale: 1, y: 0, boxShadow: '0 0 0 rgba(34,197,94,0)' }
      }
      transition={{ duration: 0.24, ease: MOTION_EASE }}
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] transition hover:border-white/15 hover:bg-white/[0.08] hover:text-white',
        compact ? 'h-9 w-9' : 'px-3 py-2 text-sm',
        className,
      )}
      aria-label={label}
      title={label}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? 'copied' : 'copy'}
          initial={{ opacity: 0, scale: 0.84, rotate: copied ? -8 : 8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.84, rotate: copied ? 8 : -8 }}
          transition={{ duration: 0.18, ease: MOTION_EASE }}
          className="inline-flex"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-300" /> : <Copy className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
      {compact ? null : (
        <span className={cn('transition-colors duration-200', copied && 'text-emerald-200')}>
          {copied ? 'Copied' : 'Copy'}
        </span>
      )}
    </motion.button>
  );
}

export default CopyButton;
