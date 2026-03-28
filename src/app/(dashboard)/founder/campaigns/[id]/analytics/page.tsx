"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  DollarSign,
  Users,
  CalendarDays,
  TrendingUp,
  ArrowLeft,
  Eye,
  MousePointerClick,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FundingProgress } from "@/components/campaign/FundingProgress";
import { LoadingState } from "@/components/shared/LoadingState";
import { formatBDT, formatDate } from "@/lib/utils";
import type { ApiResponse, CampaignStatus } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CampaignDetail {
  id: string;
  title: string;
  slug: string;
  status: CampaignStatus;
  goalAmount: number;
  raisedAmount: number;
  contributorCount: number;
  createdAt: string;
  startDate: string | null;
  endDate: string | null;
  _count: {
    contributions: number;
    comments: number;
  };
  contributions?: Contribution[];
}

interface Contribution {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  user?: {
    id: string;
    profile?: { displayName: string } | null;
  };
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

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="flex items-center gap-4">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-secondary-500 truncate">{label}</p>
        <p className="text-xl font-bold text-secondary-900 truncate">{value}</p>
      </div>
    </Card>
  );
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(
    1,
    Math.floor(
      (new Date(b).getTime() - new Date(a).getTime()) / msPerDay
    )
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CampaignAnalyticsPage() {
  const params = useParams();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        credentials: "include",
      });
      const json: ApiResponse<{ campaign: CampaignDetail }> = await res.json();

      if (!json.success || !json.data) {
        setError(json.error?.message || "Failed to load campaign");
        return;
      }

      setCampaign(json.data.campaign);

      // Fetch contributions for this campaign
      // The campaign detail endpoint doesn't include individual contributions,
      // so we use the contributions list with a campaign filter if available
      try {
        const contribRes = await fetch(
          `/api/campaigns/${campaignId}/contribute?page=1&pageSize=20`,
          { credentials: "include" }
        );
        if (contribRes.ok) {
          const contribJson = await contribRes.json();
          if (contribJson.success && contribJson.data?.contributions) {
            setContributions(contribJson.data.contributions);
          }
        }
      } catch {
        // Contributions endpoint may not support GET; that's fine
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <LoadingState text="Loading campaign analytics..." />;
  }

  if (error || !campaign) {
    return (
      <div className="py-16 text-center">
        <p className="text-secondary-500">{error || "Campaign not found"}</p>
        <Link href="/founder/campaigns">
          <Button variant="outline" className="mt-4">
            Back to Campaigns
          </Button>
        </Link>
      </div>
    );
  }

  const badge = STATUS_BADGE[campaign.status];
  const raisedAmount = Number(campaign.raisedAmount || 0);
  const goalAmount = Number(campaign.goalAmount);
  const contributorCount = campaign.contributorCount ?? 0;
  const daysActive = daysBetween(
    campaign.startDate || campaign.createdAt,
    new Date().toISOString()
  );
  const avgContribution =
    contributorCount > 0 ? raisedAmount / contributorCount : 0;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/founder/campaigns"
          className="inline-flex items-center gap-1.5 text-sm text-secondary-500 hover:text-secondary-700 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <h1 className="text-2xl font-bold text-secondary-900">
            {campaign.title}
          </h1>
          <Badge variant={badge.variant} dot>
            {badge.label}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<DollarSign className="h-6 w-6 text-emerald-600" />}
          label="Total Raised"
          value={formatBDT(raisedAmount)}
          color="bg-emerald-50"
        />
        <StatCard
          icon={<Users className="h-6 w-6 text-blue-600" />}
          label="Contributors"
          value={String(contributorCount)}
          color="bg-blue-50"
        />
        <StatCard
          icon={<CalendarDays className="h-6 w-6 text-violet-600" />}
          label="Days Active"
          value={String(daysActive)}
          color="bg-violet-50"
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 text-amber-600" />}
          label="Avg Contribution"
          value={formatBDT(Math.round(avgContribution))}
          color="bg-amber-50"
        />
      </div>

      {/* Funding Progress - large */}
      <Card className="mb-8">
        <h2 className="text-base font-semibold text-secondary-900 mb-4">
          Funding Progress
        </h2>
        <FundingProgress
          raisedAmount={raisedAmount}
          goalAmount={goalAmount}
          size="lg"
          showLabel
        />
        <div className="mt-4 flex items-center gap-6 text-sm text-secondary-500">
          {campaign.startDate && (
            <span>Started: {formatDate(campaign.startDate)}</span>
          )}
          {campaign.endDate && (
            <span>Ends: {formatDate(campaign.endDate)}</span>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contributions Over Time */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="px-6 py-4 border-b border-secondary-200">
              <h2 className="text-base font-semibold text-secondary-900">
                Recent Contributions
              </h2>
              <p className="text-xs text-secondary-400 mt-0.5">
                Chart visualization coming in a future update
              </p>
            </div>
            {contributions.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-secondary-500">
                No contributions recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary-200 bg-secondary-50/50">
                      <th className="text-left font-medium text-secondary-600 px-6 py-3">
                        Date
                      </th>
                      <th className="text-left font-medium text-secondary-600 px-4 py-3">
                        Supporter
                      </th>
                      <th className="text-right font-medium text-secondary-600 px-6 py-3">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-100">
                    {contributions.slice(0, 15).map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-secondary-50/50 transition-colors"
                      >
                        <td className="px-6 py-3 text-secondary-500">
                          {formatDate(c.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-secondary-700">
                          {c.user?.profile?.displayName || "Anonymous"}
                        </td>
                        <td className="px-6 py-3 text-right font-medium text-secondary-900">
                          {formatBDT(Number(c.amount))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

        {/* Campaign Performance */}
        <div>
          <Card>
            <h2 className="text-base font-semibold text-secondary-900 mb-4">
              Campaign Performance
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <Eye className="h-4 w-4" />
                  Total Views
                </div>
                <Badge variant="default" size="sm">
                  Coming soon
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-secondary-600">
                  <MousePointerClick className="h-4 w-4" />
                  Conversion Rate
                </div>
                <Badge variant="default" size="sm">
                  Coming soon
                </Badge>
              </div>
              <hr className="border-secondary-100" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Comments</span>
                <span className="font-medium text-secondary-900">
                  {campaign._count?.comments ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Total Contributions</span>
                <span className="font-medium text-secondary-900">
                  {campaign._count?.contributions ?? 0}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
