import * as React from "react"
import { cn } from "./utils"

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string | number; label: string }[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-textSecondary focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      >
        <option value="">Select...</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    )
  }
)
Select.displayName = "Select"

export { Select }