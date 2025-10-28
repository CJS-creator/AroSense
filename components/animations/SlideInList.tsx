import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp } from '../../lib/motionVariants';

interface SlideInListProps {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}

export const SlideInList: React.FC<SlideInListProps> = ({ children, className, stagger = 0.1, delay = 0 }) => {
  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      {React.Children.map(children, (child, index) => (
        <motion.div key={index} variants={fadeInUp}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};
