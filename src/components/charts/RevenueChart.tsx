"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatBDT } from "@/lib/utils";

interface RevenueChartProps {
  data: { period: string; revenue: number; profit: number }[];
}

function RevenueChart({ data }: RevenueChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 8, right: 24, left: 16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="period"
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
          formatter={(value, name) => [
            formatBDT(Number(value)),
            name === "revenue" ? "Revenue" : "Profit",
          ]}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            fontSize: 13,
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 13, paddingTop: 8 }}
          formatter={(value: string) =>
            value === "revenue" ? "Revenue" : "Profit"
          }
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#6366f1"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#6366f1" }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="#10b981"
          strokeWidth={2.5}
          dot={{ r: 4, fill: "#10b981" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export { RevenueChart };
