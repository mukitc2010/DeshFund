"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  DollarSign,
  Megaphone,
  Users,
  Clock,
  Plus,
  BarChart3,
  ArrowDownToLine,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { FundingProgress } from "@/components/campaign/FundingProgress";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatBDT, formatDate } from "@/lib/utils";
import type { ApiResponse, CampaignStatus, WithdrawalStatus } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Campaign {
  id: string;
  title: string;
  slug: string;
  status: CampaignStatus;
  goalAmount: number;
  raisedAmount: number;
  contributorCount: number;
  createdAt: string;
  _count?: { contributions: number };
}

interface Contribution {
  id: string;
  amount: number;
  createdAt: string;
  status: string;
  user?: {
    id: string;
    profile?: { displayName: string } | null;
  };
  campaign?: {
    id: string;
    title: string;
  };
}

interface Withdrawal {
  id: string;
  amount: number;
  status: WithdrawalStatus;
}

interface DashboardData {
  campaigns: Campaign[];
  recentContributions: Contribution[];
  withdrawals: Withdrawal[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_BADGE: Record<CampaignStatus, { variant: BadgeVariant; label: string }> = {
  DRAFT: { variant: "default", label: "Draft" },
  PENDING_REVIEW: { variant: "warning", label: "Pending" },
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FounderDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [campaignsRes, withdrawalsRes] = await Promise.all([
        fetch("/api/campaigns?pageSize=50", { credentials: "include" }),
        fetch("/api/withdrawals?pageSize=50", { credentials: "include" }),
      ]);

      const campaignsJson: ApiResponse<{ campaigns: Campaign[] }> =
        await campaignsRes.json();
      const withdrawalsJson: ApiResponse<{ withdrawals: Withdrawal[] }> =
        await withdrawalsRes.json();

      const campaigns =
        campaignsJson.success && campaignsJson.data
          ? campaignsJson.data.campaigns.filter(
              (c) => c.contributorCount !== undefined
            )
          : [];

      const withdrawals =
        withdrawalsJson.success && withdrawalsJson.data
          ? withdrawalsJson.data.withdrawals
          : [];

      // Fetch recent contributions across all own campaigns
      const ownCampaignIds = campaigns.map((c) => c.id);
      let recentContributions: Contribution[] = [];

      if (ownCampaignIds.length > 0) {
        // We'll aggregate from campaign detail endpoints
        // Fetch contributions for up to 5 campaigns to get recent ones
        const activeCampaigns = campaigns
          .filter((c) => ["ACTIVE", "FUNDED"].includes(c.status))
          .slice(0, 5);

        const contributionPromises = activeCampaigns.map(async (campaign) => {
          try {
            const res = await fetch(`/api/campaigns/${campaign.id}`, {
              credentials: "include",
            });
            const json = await res.json();
            if (json.success && json.data?.campaign) {
              return { campaignId: campaign.id, campaignTitle: campaign.title };
            }
            return null;
          } catch {
            return null;
          }
        });

        await Promise.all(contributionPromises);

        // Since there's no founder-specific contributions endpoint,
        // we show the contributor counts from campaigns instead
        recentContributions = [];
      }

      setData({ campaigns, recentContributions, withdrawals });
    } catch {
      // Silently handle errors
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return <LoadingState text="Loading your dashboard..." />;
  }

  const campaigns = data?.campaigns ?? [];
  const withdrawals = data?.withdrawals ?? [];

  // Aggregate stats
  const totalRaised = campaigns.reduce(
    (sum, c) => sum + Number(c.raisedAmount || 0),
    0
  );
  const activeCampaigns = campaigns.filter(
    (c) => c.status === "ACTIVE" || c.status === "FUNDED"
  );
  const totalContributors = campaigns.reduce(
    (sum, c) => sum + (c.contributorCount ?? 0),
    0
  );
  const pendingWithdrawals = withdrawals.filter(
    (w) => w.status === "PENDING"
  ).length;

  const displayName = user?.profile?.displayName || "Founder";

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">
          Welcome back, {displayName}!
        </h1>
        <p className="mt-1 text-sm text-secondary-500">
          Here is an overview of your fundraising activity.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<DollarSign className="h-6 w-6 text-emerald-600" />}
          label="Total Raised"
          value={formatBDT(totalRaised)}
          color="bg-emerald-50"
        />
        <StatCard
          icon={<Megaphone className="h-6 w-6 text-blue-600" />}
          label="Active Campaigns"
          value={String(activeCampaigns.length)}
          color="bg-blue-50"
        />
        <StatCard
          icon={<Users className="h-6 w-6 text-violet-600" />}
          label="Total Contributors"
          value={String(totalContributors)}
          color="bg-violet-50"
        />
        <StatCard
          icon={<Clock className="h-6 w-6 text-amber-600" />}
          label="Pending Withdrawals"
          value={String(pendingWithdrawals)}
          color="bg-amber-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My Campaigns Quick View */}
        <div className="lg:col-span-2">
          <Card padding="none">
            <div className="px-6 py-4 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-secondary-900">
                  My Campaigns
                </h2>
                <Link href="/founder/campaigns">
                  <Button variant="ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </div>
            {campaigns.length === 0 ? (
              <EmptyState
                icon={<Megaphone className="h-10 w-10" />}
                title="No campaigns yet"
                description="Create your first campaign to start raising funds."
                actionLabel="Create Campaign"
                onAction={() => {
                  window.location.href = "/founder/campaigns/new";
                }}
              />
            ) : (
              <div className="divide-y divide-secondary-100">
                {campaigns.slice(0, 5).map((campaign) => {
                  const badge = STATUS_BADGE[campaign.status];
                  return (
                    <Link
                      key={campaign.id}
                      href={`/founder/campaigns/${campaign.id}/analytics`}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-secondary-50/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium text-secondary-900 truncate">
                            {campaign.title}
                          </p>
                          <Badge variant={badge.variant} size="sm" dot>
                            {badge.label}
                          </Badge>
                        </div>
                        <FundingProgress
                          raisedAmount={Number(campaign.raisedAmount || 0)}
                          goalAmount={Number(campaign.goalAmount)}
                          size="sm"
                          showLabel={false}
                        />
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-secondary-500">
                          <span>{formatBDT(Number(campaign.raisedAmount || 0))} raised</span>
                          <span>{campaign.contributorCount ?? 0} contributors</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <h2 className="text-base font-semibold text-secondary-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link href="/founder/campaigns/new" className="block">
                <Button
                  variant="primary"
                  fullWidth
                  icon={<Plus className="h-4 w-4" />}
                >
                  Create Campaign
                </Button>
              </Link>
              <Link href="/founder/campaigns" className="block">
                <Button
                  variant="outline"
                  fullWidth
                  icon={<BarChart3 className="h-4 w-4" />}
                >
                  View Analytics
                </Button>
              </Link>
              <Link href="/founder/withdrawals" className="block">
                <Button
                  variant="outline"
                  fullWidth
                  icon={<ArrowDownToLine className="h-4 w-4" />}
                >
                  Request Withdrawal
                </Button>
              </Link>
            </div>
          </Card>

          {/* Recent Activity Summary */}
          <Card>
            <h2 className="text-base font-semibold text-secondary-900 mb-4">
              Recent Activity
            </h2>
            {campaigns.length === 0 ? (
              <p className="text-sm text-secondary-500">
                No recent activity to show.
              </p>
            ) : (
              <div className="space-y-3">
                {campaigns
                  .filter((c) => c.contributorCount > 0)
                  .slice(0, 5)
                  .map((c) => (
                    <div key={c.id} className="flex items-center justify-between text-sm">
                      <span className="text-secondary-700 truncate max-w-[160px]">
                        {c.title}
                      </span>
                      <span className="text-secondary-500 shrink-0 ml-2">
                        {c.contributorCount} backers
                      </span>
                    </div>
                  ))}
                {campaigns.filter((c) => c.contributorCount > 0).length === 0 && (
                  <p className="text-sm text-secondary-500">
                    No contributions yet.
                  </p>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
