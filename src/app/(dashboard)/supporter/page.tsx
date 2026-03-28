"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CampaignCard } from "@/components/campaign/CampaignCard";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatBDT, formatDate } from "@/lib/utils";
import {
  Wallet,
  Heart,
  Bookmark,
  Search,
  BookmarkCheck,
  Bell,
  ArrowRight,
  Receipt,
} from "lucide-react";

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

interface Campaign {
  id: string;
  title: string;
  tagline: string;
  category: string;
  slug: string;
  coverImageUrl: string | null;
  goalAmount: number;
  raisedAmount: number;
  contributorCount: number;
  founder: {
    profile: {
      displayName: string;
      avatarUrl: string | null;
    } | null;
  };
  trustScore?: { score: number } | null;
}

const STATUS_BADGE_MAP: Record<string, { variant: "warning" | "success" | "danger" | "info"; label: string }> = {
  PENDING: { variant: "warning", label: "Pending" },
  COMPLETED: { variant: "success", label: "Completed" },
  FAILED: { variant: "danger", label: "Failed" },
  REFUNDED: { variant: "info", label: "Refunded" },
};

export default function SupporterDashboard() {
  const { user } = useAuth();
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalContributed, setTotalContributed] = useState(0);
  const [campaignsBacked, setCampaignsBacked] = useState(0);
  const [savedCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [contribRes, campaignRes] = await Promise.all([
          fetch("/api/contributions?pageSize=5", { credentials: "include" }),
          fetch("/api/campaigns?sort=trending&pageSize=3", { credentials: "include" }),
        ]);

        const contribJson = await contribRes.json();
        const campaignJson = await campaignRes.json();

        if (contribJson.success && contribJson.data) {
          const items: Contribution[] = contribJson.data.contributions || [];
          setContributions(items);

          const total = items.reduce(
            (sum: number, c: Contribution) => sum + Number(c.amount),
            0
          );
          setTotalContributed(total);

          const uniqueCampaigns = new Set(items.map((c: Contribution) => c.campaign.id));
          setCampaignsBacked(uniqueCampaigns.size);
        }

        if (campaignJson.success && campaignJson.data) {
          setCampaigns(campaignJson.data.campaigns || []);
        }
      } catch {
        // Silently handle errors
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <LoadingState text="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          Welcome, {user?.profile.displayName || "Supporter"}!
        </h1>
        <p className="text-secondary-500 mt-1">
          Here is an overview of your activity and recommendations.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-secondary-500 font-medium">Total Contributed</p>
              <p className="text-lg font-bold text-secondary-900">{formatBDT(totalContributed)}</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Heart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-secondary-500 font-medium">Campaigns Backed</p>
              <p className="text-lg font-bold text-secondary-900">{campaignsBacked}</p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Bookmark className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-secondary-500 font-medium">Saved Campaigns</p>
              <p className="text-lg font-bold text-secondary-900">{savedCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Contributions */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-secondary-900">Recent Contributions</h2>
          <Link
            href="/supporter/contributions"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {contributions.length === 0 ? (
          <EmptyState
            icon={<Receipt className="h-10 w-10" />}
            title="No contributions yet"
            description="Start backing campaigns you believe in."
            actionLabel="Browse Campaigns"
            onAction={() => (window.location.href = "/campaigns")}
            className="py-8"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-100">
                  <th className="text-left py-2.5 pr-4 font-medium text-secondary-500">Campaign</th>
                  <th className="text-right py-2.5 px-4 font-medium text-secondary-500">Amount</th>
                  <th className="text-left py-2.5 px-4 font-medium text-secondary-500">Date</th>
                  <th className="text-left py-2.5 pl-4 font-medium text-secondary-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map((c) => {
                  const badge = STATUS_BADGE_MAP[c.status] || { variant: "default" as const, label: c.status };
                  return (
                    <tr key={c.id} className="border-b border-secondary-50 last:border-0">
                      <td className="py-3 pr-4">
                        <Link
                          href={`/campaigns/${c.campaign.slug || c.campaign.id}`}
                          className="text-secondary-800 hover:text-primary-600 font-medium transition-colors"
                        >
                          {c.campaign.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-secondary-800 whitespace-nowrap">
                        {formatBDT(Number(c.amount))}
                      </td>
                      <td className="py-3 px-4 text-secondary-500 whitespace-nowrap">
                        {formatDate(c.createdAt)}
                      </td>
                      <td className="py-3 pl-4">
                        <Badge variant={badge.variant} size="sm" dot>
                          {badge.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Recommended Campaigns */}
      {campaigns.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-secondary-900">Recommended Campaigns</h2>
            <Link
              href="/campaigns"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1"
            >
              See all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                title={campaign.title}
                tagline={campaign.tagline}
                category={campaign.category}
                coverImageUrl={campaign.coverImageUrl || undefined}
                raisedAmount={Number(campaign.raisedAmount)}
                goalAmount={Number(campaign.goalAmount)}
                contributorCount={campaign.contributorCount}
                founderName={campaign.founder?.profile?.displayName || "Founder"}
                founderAvatarUrl={campaign.founder?.profile?.avatarUrl || undefined}
                slug={campaign.slug || campaign.id}
                trustScore={campaign.trustScore?.score}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <Card padding="md">
        <h2 className="text-base font-semibold text-secondary-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/campaigns">
            <Button variant="outline" icon={<Search className="h-4 w-4" />}>
              Browse Campaigns
            </Button>
          </Link>
          <Link href="/supporter/saved">
            <Button variant="outline" icon={<BookmarkCheck className="h-4 w-4" />}>
              View Saved
            </Button>
          </Link>
          <Link href="/supporter/notifications">
            <Button variant="outline" icon={<Bell className="h-4 w-4" />}>
              Notifications
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
