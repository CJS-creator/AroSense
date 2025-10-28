import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../bits/Card';
import { cn } from '../bits/utils';

// FIX: Correctly typed props by creating a motion-wrapped Card component outside the render body and using its props type. This resolves type conflicts with framer-motion event handlers.
const MotionCard = motion(Card);
type HoverCardProps = React.ComponentProps<typeof MotionCard>;

export const HoverCard: React.FC<HoverCardProps> = ({ className, children, ...props }) => {
  return (
    <MotionCard
      whileHover={{ 
        y: -4, 
        scale: 1.02, 
        boxShadow: "0 10px 15px -3px rgb(var(--color-primary-light) / 0.1), 0 4px 6px -4px rgb(var(--color-primary-light) / 0.1)" 
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn("h-full", className)}
      {...props}
    >
      {children}
    </MotionCard>
  );
};