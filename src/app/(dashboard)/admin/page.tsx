"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/shared/LoadingState";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  BarChart3,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowDownToLine,
  FileCheck,
  ChevronRight,
  Activity,
} from "lucide-react";

interface Stats {
  users: { total: number; byRole: Record<string, number> };
  campaigns: { total: number; byStatus: Record<string, number> };
  contributions: { totalAmount: number; count: number };
  platformFees: number;
  pendingReviews: number;
  pendingWithdrawals: number;
  pendingVerifications: number;
  recentActivity: Array<{
    id: string;
    action: string;
    entity: string;
    entityId?: string;
    createdAt: string;
    user?: { profile?: { displayName: string } };
  }>;
}

function formatBDT(amount: number) {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(amount);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-BD", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminOverview() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats", { credentials: "include" });
        const json = await res.json();
        if (json.success) {
          setStats(json.data);
        } else {
          setError(json.error?.message || "Failed to load stats");
        }
      } catch {
        setError("Failed to load stats");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <LoadingState text="Loading admin dashboard..." />;
  if (error) return <div className="text-danger-600 text-center py-16">{error}</div>;
  if (!stats) return null;

  const kpiCards = [
    { label: "Total Users", value: stats.users.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Campaigns", value: stats.campaigns.byStatus["ACTIVE"] || 0, icon: BarChart3, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Raised", value: formatBDT(stats.contributions.totalAmount), icon: DollarSign, color: "text-primary-600", bg: "bg-primary-50" },
    { label: "Platform Revenue", value: formatBDT(stats.platformFees), icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Pending Reviews", value: stats.pendingReviews, icon: Clock, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Pending Withdrawals", value: stats.pendingWithdrawals, icon: ArrowDownToLine, color: "text-purple-600", bg: "bg-purple-50" },
  ];

  const quickActions = [
    { label: "Review Campaigns", href: "/admin/campaigns", description: `${stats.pendingReviews} pending` },
    { label: "Manage Users", href: "/admin/users", description: `${stats.users.total} total` },
    { label: "View Transactions", href: "/admin/transactions", description: `${stats.contributions.count} contributions` },
    { label: "Review Withdrawals", href: "/admin/withdrawals", description: `${stats.pendingWithdrawals} pending` },
    { label: "Review Verifications", href: "/admin/verifications", description: `${stats.pendingVerifications} pending` },
    { label: "Settings", href: "/admin/settings", description: "Platform configuration" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Admin Dashboard</h1>
        <p className="text-secondary-500 mt-1">Platform overview and management</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.label} padding="md">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <div>
                <p className="text-sm text-secondary-500">{kpi.label}</p>
                <p className="text-2xl font-bold text-secondary-900">{kpi.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card padding="none">
          <div className="px-6 py-4 border-b border-secondary-200">
            <h2 className="text-lg font-semibold text-secondary-900">Quick Actions</h2>
          </div>
          <div className="divide-y divide-secondary-100">
            {quickActions.map((action) => (
              <button
                key={action.href}
                onClick={() => router.push(action.href)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary-50 transition-colors text-left"
              >
                <div>
                  <p className="font-medium text-secondary-900">{action.label}</p>
                  <p className="text-sm text-secondary-500">{action.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-secondary-400" />
              </button>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card padding="none">
          <div className="px-6 py-4 border-b border-secondary-200">
            <h2 className="text-lg font-semibold text-secondary-900">Recent Activity</h2>
          </div>
          <div className="divide-y divide-secondary-100">
            {stats.recentActivity.length === 0 && (
              <p className="px-6 py-8 text-center text-secondary-400">No recent activity</p>
            )}
            {stats.recentActivity.map((log) => (
              <div key={log.id} className="px-6 py-3 flex items-start gap-3">
                <Activity className="h-4 w-4 text-secondary-400 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-secondary-700">
                    <span className="font-medium">{log.user?.profile?.displayName || "System"}</span>
                    {" "}{log.action.replace(".", " ")} on {log.entity}
                  </p>
                  <p className="text-xs text-secondary-400">{formatDate(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
