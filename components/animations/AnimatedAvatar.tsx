import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { scaleIn } from '../../lib/motionVariants';

interface AnimatedAvatarProps extends Omit<HTMLMotionProps<'img'>, 'src' | 'alt'> {
  src: string;
  alt: string;
}

export const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ src, alt, className, ...props }) => {
  return (
    <motion.img
      key={src} // Ensure animation re-runs if src changes
      src={src}
      alt={alt}
      className={className}
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      {...props}
    />
  );
};
