import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  text?: string;
  className?: string;
}

function LoadingState({ text, className }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6", className)}>
      <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
      {text && <p className="mt-3 text-sm text-secondary-500">{text}</p>}
    </div>
  );
}

export { LoadingState };
export type { LoadingStateProps };
