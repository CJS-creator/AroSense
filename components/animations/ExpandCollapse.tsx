import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExpandCollapseProps {
  isExpanded: boolean;
  children: React.ReactNode;
}

export const ExpandCollapse: React.FC<ExpandCollapseProps> = ({ isExpanded, children }) => {
  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <motion.div
          initial="collapsed"
          animate="expanded"
          exit="collapsed"
          variants={{
            expanded: { opacity: 1, height: 'auto' },
            collapsed: { opacity: 0, height: 0 },
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
