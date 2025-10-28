import * as React from "react"
import { cn } from "./utils"

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, pressed, onPressedChange, ...props }, ref) => (
    <button
      type="button"
      role="switch"
      aria-checked={pressed}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-DEFAULT focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        pressed ? "bg-primary-DEFAULT" : "bg-border",
        className
      )}
      {...props}
      ref={ref}
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform",
          pressed ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  )
)
Toggle.displayName = "Toggle"

export { Toggle }