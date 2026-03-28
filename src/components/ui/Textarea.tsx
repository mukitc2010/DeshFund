import React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className, id, rows = 4, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-secondary-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            "block w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-secondary-900",
            "placeholder:text-secondary-400 resize-y",
            "transition-all duration-150 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-offset-0",
            error
              ? "border-danger-500 focus:border-danger-500 focus:ring-danger-500/25"
              : "border-secondary-300 focus:border-primary-500 focus:ring-primary-500/25",
            props.disabled && "bg-secondary-50 opacity-60 cursor-not-allowed",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs text-danger-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1.5 text-xs text-secondary-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
