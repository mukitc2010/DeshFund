"use client";

import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  changeLabel?: string;
  icon: LucideIcon;
  trend: "up" | "down" | "neutral";
}

function KPICard({ title, value, change, changeLabel, icon: Icon, trend }: KPICardProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <div className="bg-white rounded-xl shadow-card border border-secondary-200/60 p-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-secondary-500">{title}</span>
        <div className="h-10 w-10 rounded-lg bg-primary-50 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary-600" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-secondary-900">{value}</p>
      </div>
      <div className="mt-2 flex items-center gap-1.5">
        <div
          className={cn(
            "flex items-center gap-0.5 text-sm font-medium",
            trend === "up" && "text-emerald-600",
            trend === "down" && "text-red-500",
            trend === "neutral" && "text-secondary-500"
          )}
        >
          <TrendIcon className="h-4 w-4" />
          <span>{change > 0 ? "+" : ""}{change}%</span>
        </div>
        {changeLabel && (
          <span className="text-xs text-secondary-400">{changeLabel}</span>
        )}
      </div>
    </div>
  );
}

export { KPICard };
export type { KPICardProps };
