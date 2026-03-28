import React from "react";
import { cn } from "@/lib/utils";

type CardPadding = "none" | "sm" | "md" | "lg";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: CardPadding;
}

const paddingStyles: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

function Card({ children, className, hover = false, padding = "md" }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-card",
        "border border-secondary-200/60",
        paddingStyles[padding],
        hover &&
          "transition-all duration-200 ease-in-out hover:shadow-elevated hover:-translate-y-0.5 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Card };
export type { CardProps, CardPadding };
