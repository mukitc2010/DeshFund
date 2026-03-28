"use client";

import { formatBDT, calculatePercentage } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface FundingProgressProps {
  raisedAmount: number;
  goalAmount: number;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function FundingProgress({
  raisedAmount,
  goalAmount,
  showLabel = true,
  size = "sm",
  className,
}: FundingProgressProps) {
  const percentage = calculatePercentage(raisedAmount, goalAmount);

  return (
    <div className={className}>
      <ProgressBar value={percentage} size={size} gradient />
      {showLabel && (
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm font-semibold text-secondary-800">
            {formatBDT(raisedAmount)}{" "}
            <span className="font-normal text-secondary-500">
              of {formatBDT(goalAmount)}
            </span>
          </span>
          <span className="text-sm font-semibold text-primary-600">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  );
}

export { FundingProgress };
export type { FundingProgressProps };
