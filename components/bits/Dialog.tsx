import * as React from "react"
import { cn } from "./utils"
import { AnimatePresence, motion } from "framer-motion";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const DialogContext = React.createContext<{
  onClose: () => void;
}>({
  onClose: () => {},
});

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  const handleClose = () => onOpenChange(false);

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <DialogContext.Provider value={{ onClose: handleClose }}>
          <motion.div 
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </DialogContext.Provider>
      )}
    </AnimatePresence>
  );
};

// FIX: Changed props type to React.ComponentPropsWithoutRef<typeof motion.div> to resolve type conflicts with framer-motion's event handlers like onDrag.
const DialogContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof motion.div>
>(({ className, ...props }, ref) => {
  // FIX: Destructuring children from props inside the body to resolve type inference issues with framer-motion's children prop.
  const { children, ...rest } = props;
  return (
    <motion.div
      ref={ref}
      className={cn("relative z-50 grid w-full max-w-lg gap-4 border bg-surface p-6 shadow-lg duration-200 rounded-b-lg md:w-full", className)}
      onClick={(e) => e.stopPropagation()}
      initial={{ scale: 0.95, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      {...rest}
    >
      {children}
      <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2 disabled:pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        <span className="sr-only">Close</span>
      </DialogClose>
    </motion.div>
  );
});
DialogContent.displayName = "DialogContent"

const DialogClose: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, ...props }) => {
  const { onClose } = React.useContext(DialogContext);
  return <button onClick={onClose} className={className} {...props} />;
};


// FIX: Converted to a motion component and updated prop types to resolve type conflicts with framer-motion's children prop.
const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof motion.div>
>(({ className, ...props }, ref) => {
    const { children, ...rest } = props;
    return (
        <motion.div
            ref={ref}
            className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
            {...rest}
        >
            {children}
        </motion.div>
    )
})
DialogHeader.displayName = "DialogHeader"

const DialogFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof motion.div>
>(({ className, ...props }, ref) => {
    const { children, ...rest } = props;
    return (
        <motion.div
            ref={ref}
            className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
            {...rest}
        >
            {children}
        </motion.div>
    )
})
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof motion.h2>
>(({ className, ...props }, ref) => {
    const { children, ...rest } = props;
    return (
        <motion.h2
            ref={ref}
            className={cn("text-lg font-semibold leading-none tracking-tight", className)}
            {...rest}
        >
            {children}
        </motion.h2>
    )
})
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof motion.p>
>(({ className, ...props }, ref) => {
    const { children, ...rest } = props;
    return (
        <motion.p
            ref={ref}
            className={cn("text-sm text-textSecondary", className)}
            {...rest}
        >
            {children}
        </motion.p>
    )
})
DialogDescription.displayName = "DialogDescription"

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}