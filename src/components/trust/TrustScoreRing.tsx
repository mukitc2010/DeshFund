"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type RingSize = "sm" | "md" | "lg";

interface TrustScoreRingProps {
  score: number;
  size?: RingSize;
}

const sizeConfig: Record<RingSize, { dimension: number; stroke: number; radius: number; fontSize: string }> = {
  sm: { dimension: 64, stroke: 5, radius: 26, fontSize: "text-sm" },
  md: { dimension: 96, stroke: 6, radius: 40, fontSize: "text-xl" },
  lg: { dimension: 140, stroke: 8, radius: 58, fontSize: "text-3xl" },
};

function getColor(score: number) {
  if (score < 30) return { stroke: "#ef4444", text: "text-red-500" };
  if (score < 60) return { stroke: "#f59e0b", text: "text-amber-500" };
  return { stroke: "#10b981", text: "text-emerald-600" };
}

function TrustScoreRing({ score, size = "md" }: TrustScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const config = sizeConfig[size];
  const circumference = 2 * Math.PI * config.radius;
  const color = getColor(score);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedScore(score), 50);
    return () => clearTimeout(timeout);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;
  const center = config.dimension / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: config.dimension, height: config.dimension }}>
      <svg
        width={config.dimension}
        height={config.dimension}
        className="-rotate-90"
      >
        <circle
          cx={center}
          cy={center}
          r={config.radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={config.stroke}
        />
        <circle
          cx={center}
          cy={center}
          r={config.radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span
        className={cn(
          "absolute font-bold",
          config.fontSize,
          color.text
        )}
      >
        {animatedScore}
      </span>
    </div>
  );
}

export { TrustScoreRing };
