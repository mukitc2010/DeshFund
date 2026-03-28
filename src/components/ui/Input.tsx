import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-secondary-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-secondary-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "block w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-secondary-900",
              "placeholder:text-secondary-400",
              "transition-all duration-150 ease-in-out",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              error
                ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/25"
                : "border-secondary-300 focus:border-primary-500 focus:ring-primary-500/25",
              icon && "pl-10",
              props.disabled && "bg-secondary-50 opacity-60 cursor-not-allowed",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-danger-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-secondary-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
