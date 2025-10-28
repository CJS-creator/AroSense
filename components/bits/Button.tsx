import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"
import { IconPlus } from "../../constants" // A default icon, might not be used often.

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-DEFAULT focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-DEFAULT text-white hover:bg-primary-dark",
        destructive: "bg-danger text-white hover:bg-red-600/90",
        outline: "border border-border bg-background hover:bg-surface-hover hover:text-textPrimary",
        secondary: "bg-secondary-DEFAULT text-white hover:bg-secondary-dark/80",
        ghost: "hover:bg-surface-hover hover:text-textPrimary",
        link: "text-primary-DEFAULT underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// FIX: Changed interface to type alias with intersection to correctly infer variant props.
// This resolves all TypeScript errors related to missing 'variant' and 'size' props on Button components.
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      >
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
