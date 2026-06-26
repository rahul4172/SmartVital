// Central animation config — import from here everywhere, never inline
export const SPRING_SMOOTH = { type: "spring", stiffness: 300, damping: 30 };
export const SPRING_BOUNCY = { type: "spring", stiffness: 400, damping: 20 };
export const SPRING_SLOW   = { type: "spring", stiffness: 150, damping: 25 };
export const EASE_OUT      = { duration: 0.3, ease: [0.16, 1, 0.3, 1] };
export const EASE_MEDICAL  = { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] };

// Stagger children
export const STAGGER_FAST = { staggerChildren: 0.06 };
export const STAGGER_MED  = { staggerChildren: 0.1 };
export const STAGGER_SLOW = { staggerChildren: 0.15 };

// Shared variants
export const fadeUp = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: EASE_MEDICAL }
};

export const fadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } }
};

export const scaleIn = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: SPRING_SMOOTH }
};

export const slideInLeft = {
  hidden:  { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0,  transition: EASE_OUT }
};

export const slideInRight = {
  hidden:  { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: EASE_OUT }
};
