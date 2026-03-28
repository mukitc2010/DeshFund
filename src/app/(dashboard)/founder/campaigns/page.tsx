"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Eye,
  Trash2,
  Loader2,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { formatBDT, formatDate, calculatePercentage } from "@/lib/utils";
import type { ApiResponse, CampaignStatus } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignRow {
  id: string;
  title: string;
  status: CampaignStatus;
  goalAmount: number;
  raisedAmount: number;
  contributorCount: number;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_BADGE: Record<CampaignStatus, { variant: BadgeVariant; label: string }> = {
  DRAFT: { variant: "default", label: "Draft" },
  PENDING_REVIEW: { variant: "warning", label: "Pending Review" },
  APPROVED: { variant: "info", label: "Approved" },
  ACTIVE: { variant: "success", label: "Active" },
  FUNDED: { variant: "info", label: "Funded" },
  REJECTED: { variant: "danger", label: "Rejected" },
  CANCELLED: { variant: "default", label: "Cancelled" },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FounderCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await fetch("/api/campaigns?own=true", {
        credentials: "include",
      });
      const json: ApiResponse<{ campaigns: CampaignRow[] }> =
        await res.json();
      if (json.success && json.data) {
        setCampaigns(json.data.campaigns);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this draft campaign?"))
      return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json: ApiResponse<unknown> = await res.json();
      if (json.success) {
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            My Campaigns
          </h1>
          <p className="mt-1 text-sm text-secondary-500">
            Manage and track all your campaigns.
          </p>
        </div>
        <Link href="/founder/campaigns/new">
          <Button icon={<Plus className="h-4 w-4" />}>
            Create New Campaign
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      {campaigns.length === 0 && (
        <Card padding="lg" className="text-center py-16">
          <FolderOpen className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-700 mb-1">
            No campaigns yet
          </h3>
          <p className="text-sm text-secondary-500 mb-6">
            Create your first campaign to start raising funds.
          </p>
          <Link href="/founder/campaigns/new">
            <Button icon={<Plus className="h-4 w-4" />}>
              Create Campaign
            </Button>
          </Link>
        </Card>
      )}

      {/* Table */}
      {campaigns.length > 0 && (
        <Card padding="none" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50/50">
                  <th className="text-left font-medium text-secondary-600 px-6 py-3">
                    Title
                  </th>
                  <th className="text-left font-medium text-secondary-600 px-4 py-3">
                    Status
                  </th>
                  <th className="text-left font-medium text-secondary-600 px-4 py-3 hidden md:table-cell">
                    Raised / Goal
                  </th>
                  <th className="text-center font-medium text-secondary-600 px-4 py-3 hidden lg:table-cell">
                    Contributors
                  </th>
                  <th className="text-left font-medium text-secondary-600 px-4 py-3 hidden sm:table-cell">
                    Created
                  </th>
                  <th className="text-right font-medium text-secondary-600 px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {campaigns.map((c) => {
                  const badge = STATUS_BADGE[c.status] || STATUS_BADGE.DRAFT;
                  const pct = calculatePercentage(
                    c.raisedAmount || 0,
                    c.goalAmount
                  );

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-secondary-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-secondary-900 truncate max-w-[240px]">
                          {c.title}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={badge.variant} dot>
                          {badge.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <div>
                          <span className="font-medium text-secondary-800">
                            {formatBDT(c.raisedAmount || 0)}
                          </span>
                          <span className="text-secondary-400 mx-1">/</span>
                          <span className="text-secondary-500">
                            {formatBDT(c.goalAmount)}
                          </span>
                        </div>
                        <div className="w-24 h-1.5 bg-secondary-200 rounded-full mt-1.5">
                          <div
                            className="h-full bg-primary-500 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center hidden lg:table-cell text-secondary-600">
                        {c.contributorCount ?? 0}
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell text-secondary-500">
                        {formatDate(c.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/founder/campaigns/${c.id}/edit`
                              )
                            }
                            className="p-1.5 rounded-md text-secondary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <Link
                            href={`/campaigns/${c.id}`}
                            className="p-1.5 rounded-md text-secondary-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          {c.status === "DRAFT" && (
                            <button
                              type="button"
                              onClick={() => handleDelete(c.id)}
                              disabled={deleting === c.id}
                              className="p-1.5 rounded-md text-secondary-400 hover:text-danger-600 hover:bg-danger-50 transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deleting === c.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
