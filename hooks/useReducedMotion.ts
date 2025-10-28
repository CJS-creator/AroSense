import { useReducedMotion } from 'framer-motion';

/**
 * A hook that returns true if the user has requested reduced motion.
 * This is a simple re-export of framer-motion's hook to fit the project's
 * specified folder structure for custom hooks.
 *
 * @returns {boolean | null} Returns true if the user prefers reduced motion, false otherwise.
 */
export function useAppReducedMotion() {
  return useReducedMotion();
}
