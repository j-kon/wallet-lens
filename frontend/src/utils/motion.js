export const MOTION_EASE = [0.22, 1, 0.36, 1];

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: MOTION_EASE },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: MOTION_EASE },
  },
};

export const softStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

export const gentleStagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

export function getReveal({
  delay = 0,
  y = 18,
  duration = 0.5,
  blur = 6,
} = {}) {
  return {
    hidden: { opacity: 0, y, filter: `blur(${blur}px)` },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        delay,
        ease: MOTION_EASE,
      },
    },
  };
}

export const listItemReveal = {
  hidden: { opacity: 0, y: 14, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.38, ease: MOTION_EASE },
  },
};

export const hoverLift = {
  y: -4,
  scale: 1.004,
  transition: { duration: 0.24, ease: MOTION_EASE },
};

export const modalBackdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.22, ease: MOTION_EASE } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: MOTION_EASE } },
};

export const modalPanel = {
  hidden: { opacity: 0, y: 28, scale: 0.982, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.28, ease: MOTION_EASE },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.985,
    filter: 'blur(6px)',
    transition: { duration: 0.2, ease: MOTION_EASE },
  },
};
