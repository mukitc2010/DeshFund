"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface MilestoneAllocationChartProps {
  milestones: { title: string; budgetAllocation: number }[];
}

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#14b8a6",
];

const RADIAN = Math.PI / 180;

function renderCustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  if (!percent || percent < 0.05) return null;
  const radius = outerRadius + 24;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
    >
      {name} ({(percent * 100).toFixed(0)}%)
    </text>
  );
}

function MilestoneAllocationChart({ milestones }: MilestoneAllocationChartProps) {
  const chartData = milestones.map((m) => ({
    name: m.title,
    value: m.budgetAllocation,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          dataKey="value"
          label={renderCustomLabel}
          labelLine={{ stroke: "#9ca3af", strokeWidth: 1 }}
          paddingAngle={2}
        >
          {chartData.map((_, idx) => (
            <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`৳${Number(value).toLocaleString("en-BD")}`, "Budget"]}
          contentStyle={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            fontSize: 13,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export { MilestoneAllocationChart };
