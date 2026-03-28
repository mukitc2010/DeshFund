"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/shared/LoadingState";

interface Transaction {
  id: string;
  provider: string;
  amount: string;
  fee: string;
  status: string;
  createdAt: string;
  contribution: {
    user: { profile?: { displayName: string } };
    campaign: { id: string; title: string };
  };
}

const statusBadge: Record<string, BadgeVariant> = {
  COMPLETED: "success",
  PENDING: "warning",
  FAILED: "danger",
  REFUNDED: "info",
};

const statusTabs = [
  { label: "All", value: "" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "PENDING" },
  { label: "Failed", value: "FAILED" },
];

const providerTabs = [
  { label: "All Providers", value: "" },
  { label: "bKash", value: "BKASH" },
  { label: "Nagad", value: "NAGAD" },
  { label: "Rocket", value: "ROCKET" },
  { label: "SSLCommerz", value: "SSLCOMMERZ" },
  { label: "Card", value: "CARD" },
];

function formatBDT(amount: string | number) {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 2 }).format(Number(amount));
}

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [providerFilter, setProviderFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  async function fetchTransactions() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (statusFilter) params.set("status", statusFilter);
      if (providerFilter) params.set("provider", providerFilter);
      const res = await fetch(`/api/admin/transactions?${params}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setTransactions(json.data.transactions);
        setTotal(json.meta?.total || 0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTransactions(); }, [statusFilter, providerFilter, page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Transaction Monitoring</h1>
        <p className="text-secondary-500 mt-1">View all platform transactions</p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2 flex-wrap">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setStatusFilter(tab.value); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? "bg-primary-600 text-white"
                  : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {providerTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setProviderFilter(tab.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                providerFilter === tab.value
                  ? "bg-secondary-700 text-white"
                  : "bg-secondary-50 text-secondary-500 hover:bg-secondary-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <LoadingState text="Loading transactions..." />
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Campaign</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Provider</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {transactions.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-secondary-400">No transactions found</td></tr>
                )}
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4 text-xs font-mono text-secondary-500">{t.id.slice(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm text-secondary-700">{t.contribution?.user?.profile?.displayName || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-secondary-600 truncate max-w-[200px]">{t.contribution?.campaign?.title || "N/A"}</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-secondary-900">{formatBDT(t.amount)}</td>
                    <td className="px-6 py-4"><Badge variant="outline" size="sm">{t.provider}</Badge></td>
                    <td className="px-6 py-4"><Badge variant={statusBadge[t.status] || "default"} dot size="sm">{t.status}</Badge></td>
                    <td className="px-6 py-4 text-sm text-secondary-500">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {total > pageSize && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200">
              <p className="text-sm text-secondary-500">
                Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button size="sm" variant="outline" disabled={page * pageSize >= total} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
