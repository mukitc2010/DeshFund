import React from "react";
import { cn } from "@/lib/utils";

type ProgressSize = "sm" | "md" | "lg";

interface ProgressBarProps {
  value: number;
  color?: string;
  size?: ProgressSize;
  showLabel?: boolean;
  animated?: boolean;
  gradient?: boolean;
  className?: string;
}

const sizeStyles: Record<ProgressSize, string> = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

function ProgressBar({
  value,
  color,
  size = "md",
  showLabel = false,
  animated = false,
  gradient = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs font-medium text-secondary-600">Progress</span>
          <span className="text-xs font-medium text-secondary-700">{clamped}%</span>
        </div>
      )}
      <div className={cn("w-full rounded-full bg-secondary-200/70 overflow-hidden", sizeStyles[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            gradient
              ? "bg-gradient-to-r from-primary-500 to-primary-400"
              : color || "bg-primary-600",
            animated && "animate-pulse"
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export { ProgressBar };
export type { ProgressBarProps, ProgressSize };
