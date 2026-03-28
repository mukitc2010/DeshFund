"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatBDT } from "@/lib/utils";

interface RevenueVsExpenseChartProps {
  data: { period: string; revenue: number; expenses: number }[];
}

function RevenueVsExpenseChart({ data }: RevenueVsExpenseChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 24, left: 16, bottom: 0 }}>
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
            name === "revenue" ? "Revenue" : "Expenses",
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
            value === "revenue" ? "Revenue" : "Expenses"
          }
        />
        <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={28} />
        <Bar dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} barSize={28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export { RevenueVsExpenseChart };
