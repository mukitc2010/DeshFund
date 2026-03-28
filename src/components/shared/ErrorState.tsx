import React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-danger-50">
        <AlertTriangle className="h-6 w-6 text-danger-500" />
      </div>
      <h3 className="text-base font-semibold text-secondary-800">{title}</h3>
      <p className="mt-1.5 text-sm text-secondary-500 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center rounded-lg border border-secondary-300 px-4 py-2 text-sm font-medium text-secondary-700 hover:bg-secondary-50 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}

export { ErrorState };
export type { ErrorStateProps };
