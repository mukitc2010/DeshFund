"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { formatBDT } from "@/lib/utils";

interface FundingProgressChartProps {
  data: { date: string; amount: number }[];
  goalAmount: number;
}

function FundingProgressChart({ data, goalAmount }: FundingProgressChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 8, right: 24, left: 16, bottom: 0 }}>
        <defs>
          <linearGradient id="fundingGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={false}
          axisLine={{ stroke: "#e5e7eb" }}
        />
        <YAxis
          tick={{ fontSize: 12, fill: "#6b7280" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v: number) => formatBDT(v)}
          width={90}
        />
        <Tooltip
          formatter={(value) => [formatBDT(Number(value)), "Raised"]}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            fontSize: 13,
          }}
        />
        <ReferenceLine
          y={goalAmount}
          stroke="#f59e0b"
          strokeDasharray="8 4"
          strokeWidth={2}
          label={{
            value: `Goal: ${formatBDT(goalAmount)}`,
            position: "right",
            fill: "#f59e0b",
            fontSize: 12,
            fontWeight: 600,
          }}
        />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#6366f1"
          strokeWidth={2.5}
          fill="url(#fundingGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export { FundingProgressChart };
