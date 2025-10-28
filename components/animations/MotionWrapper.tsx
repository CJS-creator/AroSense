import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';
import { fadeInUp } from '../../lib/motionVariants';

interface MotionWrapperProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variants?: Variants;
}

export const MotionWrapper: React.FC<MotionWrapperProps> = ({ children, variants = fadeInUp, ...props }) => {
  return (
    <motion.div variants={variants} initial="hidden" animate="visible" exit="hidden" {...props}>
      {children}
    </motion.div>
  );
};
