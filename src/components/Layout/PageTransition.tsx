import React from 'react';
import { motion } from 'framer-motion';
import { EASE_MEDICAL } from '../../lib/motion';

const pageVariants = {
  initial:  { opacity: 0, y: 12 },
  animate:  { opacity: 1, y: 0,  transition: EASE_MEDICAL },
  exit:     { opacity: 0, y: -8, transition: { duration: 0.2 } }
};

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{ width: '100%' }}
  >
    {children}
  </motion.div>
);
