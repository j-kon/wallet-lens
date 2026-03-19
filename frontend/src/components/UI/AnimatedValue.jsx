import { useEffect, useState } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import { MOTION_EASE } from '../../utils/motion';

function AnimatedValue({
  value = 0,
  formatter,
  decimals = 0,
  className = '',
  duration = 0.7,
}) {
  const motionValue = useMotionValue(Number(value) || 0);
  const [displayValue, setDisplayValue] = useState(() => formatter(Number(value) || 0));

  useEffect(() => {
    const unsubscribe = motionValue.on('change', (latest) => {
      const nextValue =
        decimals > 0 ? Number(latest.toFixed(decimals)) : Math.round(latest);
      setDisplayValue(formatter(nextValue));
    });

    const controls = animate(motionValue, Number(value) || 0, {
      duration,
      ease: MOTION_EASE,
    });

    return () => {
      unsubscribe();
      controls.stop();
    };
  }, [decimals, duration, formatter, motionValue, value]);

  return (
    <motion.span
      key={value}
      initial={{ opacity: 0.55, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: MOTION_EASE }}
      className={className}
    >
      {displayValue}
    </motion.span>
  );
}

export default AnimatedValue;
