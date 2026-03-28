"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatBDT, formatDate } from "@/lib/utils";
import { Receipt, ChevronLeft, ChevronRight, Wallet } from "lucide-react";

interface ContributionCampaign {
  id: string;
  title: string;
  slug: string;
  status: string;
}

interface Contribution {
  id: string;
  amount: string | number;
  status: string;
  paymentProvider: string | null;
  createdAt: string;
  campaign: ContributionCampaign;
}

const STATUS_BADGE_MAP: Record<string, { variant: "warning" | "success" | "danger" | "info"; label: string }> = {
  PENDING: { variant: "warning", label: "Pending" },
  COMPLETED: { variant: "success", label: "Completed" },
  FAILED: { variant: "danger", label: "Failed" },
  REFUNDED: { variant: "info", label: "Refunded" },
};

const PROVIDER_LABELS: Record<string, string> = {
  BKASH: "bKash",
  NAGAD: "Nagad",
  ROCKET: "Rocket",
  SSLCOMMERZ: "SSLCommerz",
  CARD: "Card",
};

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalContributed, setTotalContributed] = useState(0);
  const pageSize = 10;

  const fetchContributions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/contributions?page=${page}&pageSize=${pageSize}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (json.success && json.data) {
        const items: Contribution[] = json.data.contributions || [];
        setContributions(items);
        setTotal(json.meta?.total || 0);

        // Calculate total from all contributions (first page load approximation)
        // For accuracy, a dedicated endpoint would be better
        const sum = items.reduce((acc: number, c: Contribution) => acc + Number(c.amount), 0);
        if (page === 1) {
          setTotalContributed(sum);
        }
      }
    } catch {
      // Silently handle
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  const totalPages = Math.ceil(total / pageSize);

  if (loading && contributions.length === 0) {
    return <LoadingState text="Loading contributions..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">My Contributions</h1>
          <p className="text-secondary-500 mt-1">Track all your campaign contributions.</p>
        </div>
        {totalContributed > 0 && (
          <Card padding="sm" className="inline-flex items-center gap-3 sm:self-start">
            <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Wallet className="h-4.5 w-4.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-[11px] text-secondary-500 font-medium">Total Contributed</p>
              <p className="text-base font-bold text-secondary-900">{formatBDT(totalContributed)}</p>
            </div>
          </Card>
        )}
      </div>

      {/* Table */}
      {contributions.length === 0 ? (
        <Card padding="lg">
          <EmptyState
            icon={<Receipt className="h-12 w-12" />}
            title="No contributions yet"
            description="When you contribute to campaigns, they will appear here."
            actionLabel="Browse Campaigns"
            onAction={() => (window.location.href = "/campaigns")}
          />
        </Card>
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50/50">
                  <th className="text-left py-3 px-5 font-medium text-secondary-500">Campaign</th>
                  <th className="text-right py-3 px-5 font-medium text-secondary-500">Amount</th>
                  <th className="text-left py-3 px-5 font-medium text-secondary-500">Payment</th>
                  <th className="text-left py-3 px-5 font-medium text-secondary-500">Status</th>
                  <th className="text-left py-3 px-5 font-medium text-secondary-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c) => {
                  const badge = STATUS_BADGE_MAP[c.status] || {
                    variant: "default" as const,
                    label: c.status,
                  };
                  return (
                    <tr
                      key={c.id}
                      className="border-b border-secondary-100 last:border-0 hover:bg-secondary-50/30 transition-colors"
                    >
                      <td className="py-3.5 px-5">
                        <Link
                          href={`/campaigns/${c.campaign.slug || c.campaign.id}`}
                          className="text-secondary-800 hover:text-primary-600 font-medium transition-colors"
                        >
                          {c.campaign.title}
                        </Link>
                      </td>
                      <td className="py-3.5 px-5 text-right font-medium text-secondary-800 whitespace-nowrap">
                        {formatBDT(Number(c.amount))}
                      </td>
                      <td className="py-3.5 px-5">
                        {c.paymentProvider ? (
                          <Badge variant="outline" size="sm">
                            {PROVIDER_LABELS[c.paymentProvider] || c.paymentProvider}
                          </Badge>
                        ) : (
                          <span className="text-secondary-400">--</span>
                        )}
                      </td>
                      <td className="py-3.5 px-5">
                        <Badge variant={badge.variant} size="sm" dot>
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-5 text-secondary-500 whitespace-nowrap">
                        {formatDate(c.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-secondary-100">
              <p className="text-xs text-secondary-500">
                Showing {(page - 1) * pageSize + 1}--{Math.min(page * pageSize, total)} of {total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  icon={<ChevronLeft className="h-3.5 w-3.5" />}
                >
                  Prev
                </Button>
                <span className="text-xs text-secondary-600 px-2">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  icon={<ChevronRight className="h-3.5 w-3.5" />}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
