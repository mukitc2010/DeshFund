import React from "react";
import { cn } from "@/lib/utils";

type SkeletonVariant = "text" | "rectangle" | "circle" | "card";

interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
  className?: string;
}

function Skeleton({ variant = "text", width, height, className }: SkeletonProps) {
  const style: React.CSSProperties = {
    width: width ?? undefined,
    height: height ?? undefined,
  };

  const base = "animate-pulse bg-secondary-200/70";

  const variantStyles: Record<SkeletonVariant, string> = {
    text: cn(base, "h-4 w-full rounded-md"),
    rectangle: cn(base, "w-full h-24 rounded-lg"),
    circle: cn(base, "h-10 w-10 rounded-full"),
    card: cn(base, "w-full h-40 rounded-xl"),
  };

  return <div className={cn(variantStyles[variant], className)} style={style} />;
}

export { Skeleton };
export type { SkeletonProps, SkeletonVariant };
