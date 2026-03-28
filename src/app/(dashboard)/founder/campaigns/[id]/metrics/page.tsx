"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatBDT } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUp,
  ArrowDown,
  Users,
  DollarSign,
  BarChart3,
  UserPlus,
  Loader2,
} from "lucide-react";

interface MetricData {
  id: string;
  period: string;
  revenue: number | null;
  profit: number | null;
  customers: number | null;
  users: number | null;
  orders: number | null;
  expenses: number | null;
  cashFlow: number | null;
  teamSize: number | null;
  mom: {
    revenue: number | null;
    users: number | null;
    customers: number | null;
  };
  yoy: {
    revenue: number | null;
    users: number | null;
    customers: number | null;
  };
}

interface Summary {
  bestMonth: { period: string; revenue: number } | null;
  trendDirection: "up" | "down" | "neutral";
  avgMonthlyGrowth: number | null;
}

interface Campaign {
  id: string;
  title: string;
}

const MONTHS = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => currentYear - 5 + i);

function GrowthIndicator({ value }: { value: number | null }) {
  if (value === null) return <span className="text-secondary-400">--</span>;
  if (value > 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green-600">
        <ArrowUp className="h-3 w-3" />
        {value}%
      </span>
    );
  }
  if (value < 0) {
    return (
      <span className="inline-flex items-center gap-0.5 text-xs font-medium text-red-600">
        <ArrowDown className="h-3 w-3" />
        {Math.abs(value)}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5 text-xs font-medium text-secondary-500">
      <Minus className="h-3 w-3" />
      0%
    </span>
  );
}

function formatPeriodLabel(period: string): string {
  const [year, month] = period.split("-");
  const m = MONTHS.find((mo) => mo.value === month);
  return m ? `${m.label.slice(0, 3)} ${year}` : period;
}

export default function MetricsPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [selectedMonth, setSelectedMonth] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );
  const [selectedYear, setSelectedYear] = useState(String(currentYear));
  const [formData, setFormData] = useState({
    revenue: "",
    profit: "",
    customers: "",
    users: "",
    orders: "",
    expenses: "",
    cashFlow: "",
    teamSize: "",
  });

  const period = `${selectedYear}-${selectedMonth}`;

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/metrics`);
      const json = await res.json();
      if (json.success) {
        setMetrics(json.data.metrics);
        setSummary(json.data.summary);
      }
    } catch {
      // silent
    }
  }, [campaignId]);

  const fetchCampaign = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`);
      const json = await res.json();
      if (json.success) {
        setCampaign({ id: json.data.campaign.id, title: json.data.campaign.title });
      }
    } catch {
      // silent
    }
  }, [campaignId]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      await Promise.all([fetchCampaign(), fetchMetrics()]);
      setLoading(false);
    }
    load();
  }, [fetchCampaign, fetchMetrics]);

  // Pre-fill form when period changes or metrics load
  useEffect(() => {
    const existing = metrics.find((m) => m.period === period);
    if (existing) {
      setFormData({
        revenue: existing.revenue !== null ? String(existing.revenue) : "",
        profit: existing.profit !== null ? String(existing.profit) : "",
        customers: existing.customers !== null ? String(existing.customers) : "",
        users: existing.users !== null ? String(existing.users) : "",
        orders: existing.orders !== null ? String(existing.orders) : "",
        expenses: existing.expenses !== null ? String(existing.expenses) : "",
        cashFlow: existing.cashFlow !== null ? String(existing.cashFlow) : "",
        teamSize: existing.teamSize !== null ? String(existing.teamSize) : "",
      });
    } else {
      setFormData({
        revenue: "",
        profit: "",
        customers: "",
        users: "",
        orders: "",
        expenses: "",
        cashFlow: "",
        teamSize: "",
      });
    }
  }, [period, metrics]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setError(null);
    setSuccessMsg(null);
    setSaving(true);

    try {
      const payload: Record<string, unknown> = { period };

      const numericMoney = ["revenue", "profit", "expenses", "cashFlow"] as const;
      const numericInt = ["customers", "users", "orders", "teamSize"] as const;

      for (const field of numericMoney) {
        const val = formData[field].trim();
        payload[field] = val === "" ? null : parseFloat(val);
      }
      for (const field of numericInt) {
        const val = formData[field].trim();
        payload[field] = val === "" ? null : parseInt(val, 10);
      }

      const res = await fetch(`/api/campaigns/${campaignId}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error?.message || "Failed to save metrics");
        return;
      }

      setSuccessMsg("Metrics saved successfully");
      setTimeout(() => setSuccessMsg(null), 3000);
      await fetchMetrics();
    } catch {
      setError("Failed to save metrics");
    } finally {
      setSaving(false);
    }
  };

  const handleRowClick = (metric: MetricData) => {
    const [year, month] = metric.period.split("-");
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const latestMetric = metrics.length > 0 ? metrics[metrics.length - 1] : null;
  const totalCustomers = metrics.reduce((sum, m) => {
    if (m.customers !== null && m.customers > (sum ?? 0)) return m.customers;
    return sum;
  }, null as number | null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          Growth Metrics{campaign ? ` \u2014 ${campaign.title}` : ""}
        </h1>
        <p className="mt-1 text-sm text-secondary-500">
          Track and manage your campaign&apos;s growth data month by month.
        </p>
      </div>

      {/* Quick Stats Cards */}
      {metrics.length > 0 && summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-secondary-500">Latest Revenue</p>
                <p className="text-lg font-semibold text-secondary-900">
                  {latestMetric?.revenue !== null
                    ? formatBDT(latestMetric!.revenue!)
                    : "--"}
                </p>
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <UserPlus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-secondary-500">Total Customers</p>
                <p className="text-lg font-semibold text-secondary-900">
                  {totalCustomers !== null
                    ? totalCustomers.toLocaleString()
                    : "--"}
                </p>
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-secondary-500">Avg Monthly Growth</p>
                <p className="text-lg font-semibold text-secondary-900">
                  {summary.avgMonthlyGrowth !== null
                    ? `${summary.avgMonthlyGrowth}%`
                    : "--"}
                </p>
              </div>
            </div>
          </Card>

          <Card padding="sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-secondary-500">Team Size</p>
                <p className="text-lg font-semibold text-secondary-900">
                  {latestMetric?.teamSize !== null
                    ? latestMetric!.teamSize
                    : "--"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Trend Direction */}
      {summary && metrics.length >= 2 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-secondary-500">Revenue Trend:</span>
          {summary.trendDirection === "up" && (
            <span className="inline-flex items-center gap-1 text-green-600 font-medium">
              <TrendingUp className="h-4 w-4" /> Upward
            </span>
          )}
          {summary.trendDirection === "down" && (
            <span className="inline-flex items-center gap-1 text-red-600 font-medium">
              <TrendingDown className="h-4 w-4" /> Downward
            </span>
          )}
          {summary.trendDirection === "neutral" && (
            <span className="inline-flex items-center gap-1 text-secondary-500 font-medium">
              <Minus className="h-4 w-4" /> Neutral
            </span>
          )}
          {summary.bestMonth && (
            <span className="ml-4 text-secondary-500">
              Best month: <span className="font-medium text-secondary-700">{formatPeriodLabel(summary.bestMonth.period)}</span> ({formatBDT(summary.bestMonth.revenue)})
            </span>
          )}
        </div>
      )}

      {/* Add/Edit Metric Form */}
      <Card>
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">
          {metrics.find((m) => m.period === period) ? "Edit" : "Add"} Metric Data
        </h2>

        {/* Period Selector */}
        <div className="flex gap-3 mb-6">
          <div className="w-full">
            <label className="block text-sm font-medium text-secondary-700 mb-1.5">
              Month
            </label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block w-full rounded-lg border border-secondary-300 bg-white px-3.5 py-2 text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500"
            >
              {MONTHS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-secondary-700 mb-1.5">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="block w-full rounded-lg border border-secondary-300 bg-white px-3.5 py-2 text-sm text-secondary-900 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500"
            >
              {YEARS.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Metric Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Input
            label="Revenue"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.revenue}
            onChange={(e) => handleInputChange("revenue", e.target.value)}
            icon={<span className="text-xs font-medium">৳</span>}
          />
          <Input
            label="Profit"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.profit}
            onChange={(e) => handleInputChange("profit", e.target.value)}
            icon={<span className="text-xs font-medium">৳</span>}
          />
          <Input
            label="Customers"
            type="number"
            step="1"
            placeholder="0"
            value={formData.customers}
            onChange={(e) => handleInputChange("customers", e.target.value)}
            icon={<span className="text-xs font-medium">#</span>}
          />
          <Input
            label="Users"
            type="number"
            step="1"
            placeholder="0"
            value={formData.users}
            onChange={(e) => handleInputChange("users", e.target.value)}
            icon={<span className="text-xs font-medium">#</span>}
          />
          <Input
            label="Orders"
            type="number"
            step="1"
            placeholder="0"
            value={formData.orders}
            onChange={(e) => handleInputChange("orders", e.target.value)}
            icon={<span className="text-xs font-medium">#</span>}
          />
          <Input
            label="Expenses"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.expenses}
            onChange={(e) => handleInputChange("expenses", e.target.value)}
            icon={<span className="text-xs font-medium">৳</span>}
          />
          <Input
            label="Cash Flow"
            type="number"
            step="0.01"
            placeholder="0.00"
            value={formData.cashFlow}
            onChange={(e) => handleInputChange("cashFlow", e.target.value)}
            icon={<span className="text-xs font-medium">৳</span>}
          />
          <Input
            label="Team Size"
            type="number"
            step="1"
            placeholder="0"
            value={formData.teamSize}
            onChange={(e) => handleInputChange("teamSize", e.target.value)}
            icon={<span className="text-xs font-medium">#</span>}
          />
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-danger-50 border border-danger-200 px-4 py-3 text-sm text-danger-700">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
            {successMsg}
          </div>
        )}

        <Button onClick={handleSave} loading={saving}>
          Save Metrics
        </Button>
      </Card>

      {/* Metrics Table */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">Monthly Metrics</h2>
        </div>

        {metrics.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-secondary-300" />
            <h3 className="mt-3 text-sm font-medium text-secondary-900">No metrics yet</h3>
            <p className="mt-1 text-sm text-secondary-500">
              Add your first month of growth data using the form above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50/50">
                  <th className="px-4 py-3 text-left font-medium text-secondary-600">Period</th>
                  <th className="px-4 py-3 text-right font-medium text-secondary-600">Revenue</th>
                  <th className="px-4 py-3 text-right font-medium text-secondary-600">Profit</th>
                  <th className="px-4 py-3 text-right font-medium text-secondary-600">Customers</th>
                  <th className="px-4 py-3 text-right font-medium text-secondary-600">Users</th>
                  <th className="px-4 py-3 text-right font-medium text-secondary-600">Orders</th>
                  <th className="px-4 py-3 text-right font-medium text-secondary-600">Expenses</th>
                  <th className="px-4 py-3 text-right font-medium text-secondary-600">Cash Flow</th>
                  <th className="px-4 py-3 text-right font-medium text-secondary-600">Team Size</th>
                </tr>
              </thead>
              <tbody>
                {[...metrics].reverse().map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => handleRowClick(m)}
                    className={`border-b border-secondary-100 cursor-pointer transition-colors hover:bg-primary-50/50 ${
                      m.period === period ? "bg-primary-50" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-secondary-900">
                      {formatPeriodLabel(m.period)}
                    </td>
                    <td className="px-4 py-3 text-right text-secondary-700">
                      <div>{m.revenue !== null ? formatBDT(m.revenue) : "--"}</div>
                      <GrowthIndicator value={m.mom.revenue} />
                    </td>
                    <td className="px-4 py-3 text-right text-secondary-700">
                      {m.profit !== null ? formatBDT(m.profit) : "--"}
                    </td>
                    <td className="px-4 py-3 text-right text-secondary-700">
                      <div>{m.customers !== null ? m.customers.toLocaleString() : "--"}</div>
                      <GrowthIndicator value={m.mom.customers} />
                    </td>
                    <td className="px-4 py-3 text-right text-secondary-700">
                      <div>{m.users !== null ? m.users.toLocaleString() : "--"}</div>
                      <GrowthIndicator value={m.mom.users} />
                    </td>
                    <td className="px-4 py-3 text-right text-secondary-700">
                      {m.orders !== null ? m.orders.toLocaleString() : "--"}
                    </td>
                    <td className="px-4 py-3 text-right text-secondary-700">
                      {m.expenses !== null ? formatBDT(m.expenses) : "--"}
                    </td>
                    <td className="px-4 py-3 text-right text-secondary-700">
                      {m.cashFlow !== null ? formatBDT(m.cashFlow) : "--"}
                    </td>
                    <td className="px-4 py-3 text-right text-secondary-700">
                      {m.teamSize !== null ? m.teamSize : "--"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
