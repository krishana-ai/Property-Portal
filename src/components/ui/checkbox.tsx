import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          "h-4 w-4 cursor-pointer rounded border-slate-300 text-primary-600 focus:ring-2 focus:ring-primary-600 focus:ring-offset-0",
          className
        )}
        {...props}
      />
    );
  }
);
Checkbox.displayName = "Checkbox";
