"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { cn, formatBDT, formatDate, calculatePercentage } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Tabs } from "@/components/ui/Tabs";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FundingProgress } from "./FundingProgress";
import { ContributeModal } from "./ContributeModal";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  Users,
  Clock,
  Shield,
  Bookmark,
  BookmarkCheck,
  Share2,
  ExternalLink,
  Calendar,
  Target,
  CheckCircle2,
  MessageSquare,
  Megaphone,
  MapPin,
  Building2,
  Globe,
  Link2,
} from "lucide-react";
import type { MilestoneStatus, CampaignStatus } from "@/types";
import { getMockCampaign } from "@/lib/mock-data";

// --- Types for the API response ---

interface FounderProfile {
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  companyName: string | null;
  companyRole: string | null;
  location: string | null;
  website: string | null;
  linkedin: string | null;
}

interface FounderTrustScore {
  score: number;
  kycComplete: boolean;
  revenueVerified: boolean;
  businessReg: boolean;
  badges: string[];
}

interface Founder {
  id: string;
  email: string;
  role: string;
  profile: FounderProfile | null;
  trustScore: FounderTrustScore | null;
}

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  budgetAllocation: number | null;
  targetDate: string | null;
  completionPct: number;
  status: MilestoneStatus;
  sortOrder: number;
}

interface CampaignUpdate {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Comment {
  id: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  user: {
    id: string;
    profile: { displayName: string; avatarUrl: string | null } | null;
  };
  replies?: Comment[];
}

interface CampaignData {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  category: string;
  coverImageUrl: string | null;
  goalAmount: number;
  raisedAmount: number;
  contributorCount: number;
  status: CampaignStatus;
  startDate: string | null;
  endDate: string | null;
  founderId: string;
  founder: Founder;
  milestones: Milestone[];
  updates: CampaignUpdate[];
  _count: {
    contributions: number;
    comments: number;
  };
}

// --- Gradient helper (same as CampaignCard) ---

const gradientCovers = [
  "from-indigo-400 via-purple-400 to-pink-400",
  "from-emerald-400 via-teal-400 to-cyan-400",
  "from-orange-400 via-rose-400 to-pink-400",
  "from-blue-400 via-indigo-400 to-violet-400",
  "from-fuchsia-400 via-pink-400 to-rose-400",
  "from-cyan-400 via-blue-400 to-indigo-400",
];

function getGradient(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradientCovers[Math.abs(hash) % gradientCovers.length];
}

// --- Milestone status badge variant ---

const milestoneStatusVariant: Record<MilestoneStatus, "default" | "info" | "success" | "danger"> = {
  PLANNED: "default",
  IN_PROGRESS: "info",
  COMPLETED: "success",
  OVERDUE: "danger",
};

// --- Trust Score Ring ---

function TrustScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const color =
    score >= 70 ? "text-emerald-500" : score >= 40 ? "text-amber-500" : "text-secondary-400";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className={color}
        />
      </svg>
      <span className="absolute text-xs font-bold text-secondary-700">{score}</span>
    </div>
  );
}

// --- Days remaining helper ---

function getDaysRemaining(endDate: string | null): number | null {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// --- Tabs config ---

const tabItems = [
  { label: "Story", value: "story" },
  { label: "Milestones", value: "milestones" },
  { label: "Updates", value: "updates" },
  { label: "Comments", value: "comments" },
];

// --- Main Component ---

interface CampaignDetailProps {
  campaignId: string;
}

function CampaignDetail({ campaignId }: CampaignDetailProps) {
  const { user } = useAuth();
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("story");
  const [showContribute, setShowContribute] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);

  async function fetchCampaign() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load campaign");
      }
      setCampaign(json.data.campaign);
    } catch {
      // Fallback to mock data when DB is unavailable
      const mock = getMockCampaign(campaignId);
      if (mock) {
        setCampaign(mock as unknown as CampaignData);
      } else {
        setError("Campaign not found");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  if (loading) {
    return <LoadingState text="Loading campaign..." className="min-h-[60vh]" />;
  }

  if (error || !campaign) {
    return (
      <ErrorState
        title="Campaign not found"
        message={error || "The campaign you're looking for doesn't exist or has been removed."}
        onRetry={fetchCampaign}
        className="min-h-[60vh]"
      />
    );
  }

  const isOwner = user?.id === campaign.founderId;
  const canContribute = !!user && !isOwner && campaign.status === "ACTIVE";
  const daysRemaining = getDaysRemaining(campaign.endDate);
  const founder = campaign.founder;
  const profile = founder.profile;
  const trustScore = founder.trustScore;

  async function handleToggleSave() {
    if (!user) return;
    setSavingBookmark(true);
    // Optimistic toggle
    setIsSaved((prev) => !prev);
    setSavingBookmark(false);
  }

  function handleContributeSuccess() {
    // Refresh campaign data to update raised amount
    fetchCampaign();
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Cover Image */}
      <div className="relative w-full h-64 sm:h-80 lg:h-[400px] overflow-hidden">
        {campaign.coverImageUrl ? (
          <img
            src={campaign.coverImageUrl}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className={cn(
              "w-full h-full bg-gradient-to-br",
              getGradient(campaign.id)
            )}
          />
        )}
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Category badge */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
          <Badge
            variant="default"
            size="md"
            className="bg-white/90 text-secondary-700 backdrop-blur-sm shadow-sm"
          >
            {campaign.category}
          </Badge>
        </div>

        {/* Title on cover */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-0 pb-6 lg:pb-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-2">
              {campaign.title}
            </h1>
            <p className="text-base sm:text-lg text-white/80 max-w-2xl">
              {campaign.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-0 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content (2/3) */}
          <div className="flex-1 min-w-0 lg:max-w-[calc(66.667%-1rem)]">
            <Tabs
              tabs={tabItems}
              activeTab={activeTab}
              onChange={setActiveTab}
              className="mb-6"
            />

            {/* Story Tab */}
            {activeTab === "story" && (
              <Card padding="lg">
                <div className="prose prose-secondary max-w-none">
                  {campaign.description.split("\n").map((paragraph, i) =>
                    paragraph.trim() ? (
                      <p key={i} className="text-secondary-700 leading-relaxed mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ) : null
                  )}
                </div>
              </Card>
            )}

            {/* Milestones Tab */}
            {activeTab === "milestones" && (
              <div className="space-y-4">
                {campaign.milestones.length === 0 ? (
                  <Card padding="lg">
                    <div className="flex flex-col items-center py-8 text-center">
                      <Target className="h-10 w-10 text-secondary-300 mb-3" />
                      <p className="text-sm text-secondary-500">
                        No milestones have been set for this campaign yet.
                      </p>
                    </div>
                  </Card>
                ) : (
                  campaign.milestones.map((milestone, index) => (
                    <Card key={milestone.id} padding="md">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold shrink-0 mt-0.5",
                              milestone.status === "COMPLETED"
                                ? "bg-emerald-100 text-emerald-700"
                                : milestone.status === "IN_PROGRESS"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-secondary-100 text-secondary-600"
                            )}
                          >
                            {milestone.status === "COMPLETED" ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-secondary-900">
                              {milestone.title}
                            </h4>
                            {milestone.description && (
                              <p className="text-sm text-secondary-500 mt-0.5">
                                {milestone.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge
                          variant={milestoneStatusVariant[milestone.status]}
                          size="sm"
                        >
                          {milestone.status.replace("_", " ")}
                        </Badge>
                      </div>

                      <div className="ml-11">
                        <ProgressBar
                          value={milestone.completionPct}
                          size="sm"
                          gradient
                          className="mb-2"
                        />
                        <div className="flex items-center gap-4 text-xs text-secondary-500">
                          {milestone.budgetAllocation != null && (
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {formatBDT(Number(milestone.budgetAllocation))}
                            </span>
                          )}
                          {milestone.targetDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(milestone.targetDate)}
                            </span>
                          )}
                          <span>{milestone.completionPct}% complete</span>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Updates Tab */}
            {activeTab === "updates" && (
              <div className="space-y-4">
                {campaign.updates.length === 0 ? (
                  <Card padding="lg">
                    <div className="flex flex-col items-center py-8 text-center">
                      <Megaphone className="h-10 w-10 text-secondary-300 mb-3" />
                      <p className="text-sm text-secondary-500">
                        No updates have been posted yet.
                      </p>
                    </div>
                  </Card>
                ) : (
                  campaign.updates.map((update) => (
                    <Card key={update.id} padding="md">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-secondary-900">
                          {update.title}
                        </h4>
                        <span className="text-xs text-secondary-400">
                          {formatDate(update.createdAt)}
                        </span>
                      </div>
                      <div className="text-sm text-secondary-600 leading-relaxed">
                        {update.content.split("\n").map((p, i) =>
                          p.trim() ? (
                            <p key={i} className="mb-2 last:mb-0">
                              {p}
                            </p>
                          ) : null
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Comments Tab */}
            {activeTab === "comments" && (
              <Card padding="lg">
                <div className="flex flex-col items-center py-8 text-center">
                  <MessageSquare className="h-10 w-10 text-secondary-300 mb-3" />
                  <p className="text-sm text-secondary-500">
                    Comments are coming soon. Stay tuned!
                  </p>
                  <p className="text-xs text-secondary-400 mt-1">
                    {campaign._count.comments} comment{campaign._count.comments !== 1 ? "s" : ""} will appear here
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar (1/3) */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-5">
            {/* Funding Progress Card */}
            <Card padding="md">
              <FundingProgress
                raisedAmount={Number(campaign.raisedAmount)}
                goalAmount={Number(campaign.goalAmount)}
                size="md"
                className="mb-5"
              />

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-secondary-500 mb-1">
                    <Users className="h-4 w-4" />
                  </div>
                  <p className="text-lg font-bold text-secondary-900">
                    {campaign.contributorCount}
                  </p>
                  <p className="text-xs text-secondary-500">Contributors</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5 text-secondary-500 mb-1">
                    <Clock className="h-4 w-4" />
                  </div>
                  <p className="text-lg font-bold text-secondary-900">
                    {daysRemaining !== null ? daysRemaining : "--"}
                  </p>
                  <p className="text-xs text-secondary-500">
                    {daysRemaining === 0 ? "Campaign ended" : "Days left"}
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2.5">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  disabled={!canContribute}
                  onClick={() => setShowContribute(true)}
                >
                  Back This Project
                </Button>

                {!user && (
                  <p className="text-xs text-center text-secondary-400">
                    <Link href="/login" className="text-primary-600 hover:underline">
                      Sign in
                    </Link>{" "}
                    to contribute
                  </p>
                )}

                {isOwner && (
                  <p className="text-xs text-center text-secondary-400">
                    You cannot contribute to your own campaign
                  </p>
                )}

                <Button
                  variant="outline"
                  size="md"
                  fullWidth
                  icon={isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  onClick={handleToggleSave}
                  disabled={!user}
                >
                  {isSaved ? "Saved" : "Save Campaign"}
                </Button>
              </div>
            </Card>

            {/* Founder Card */}
            <Card padding="md">
              <div className="flex items-center gap-3 mb-4">
                <Avatar
                  src={profile?.avatarUrl}
                  fallback={profile?.displayName || "Founder"}
                  size="lg"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-secondary-900 truncate">
                    {profile?.displayName || "Anonymous Founder"}
                  </h4>
                  {profile?.companyName && (
                    <p className="text-xs text-secondary-500 truncate">
                      {profile.companyRole && `${profile.companyRole} at `}
                      {profile.companyName}
                    </p>
                  )}
                </div>
                {trustScore && (
                  <TrustScoreRing score={trustScore.score} />
                )}
              </div>

              {/* Trust badges */}
              {trustScore && trustScore.badges.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {trustScore.badges.map((badge) => (
                    <Badge key={badge} variant="success" size="sm" dot>
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Verification indicators */}
              {trustScore && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {trustScore.kycComplete && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <Shield className="h-3.5 w-3.5" />
                      KYC Verified
                    </div>
                  )}
                  {trustScore.businessReg && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <Building2 className="h-3.5 w-3.5" />
                      Registered
                    </div>
                  )}
                  {trustScore.revenueVerified && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Revenue Verified
                    </div>
                  )}
                </div>
              )}

              {/* Founder details */}
              {profile && (
                <div className="space-y-2 mb-4">
                  {profile.location && (
                    <div className="flex items-center gap-2 text-xs text-secondary-500">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      {profile.location}
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-2 text-xs text-secondary-500">
                      <Globe className="h-3.5 w-3.5 shrink-0" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline truncate"
                      >
                        {profile.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                  {profile.linkedin && (
                    <div className="flex items-center gap-2 text-xs text-secondary-500">
                      <Link2 className="h-3.5 w-3.5 shrink-0" />
                      <a
                        href={profile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline truncate"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              )}

              <Link
                href={`/founders/${founder.id}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
              >
                View Profile
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Card>

            {/* Share (placeholder) */}
            <Card padding="md">
              <h4 className="text-sm font-semibold text-secondary-800 mb-3">
                Share this campaign
              </h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Share2 className="h-3.5 w-3.5" />}
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: campaign.title,
                        text: campaign.tagline,
                        url: window.location.href,
                      });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                    }
                  }}
                >
                  Share
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile sticky CTA */}
      {canContribute && (
        <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-secondary-200 px-4 py-3 z-40">
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-secondary-500 truncate">
                {formatBDT(Number(campaign.raisedAmount))} raised
              </p>
              <p className="text-sm font-semibold text-secondary-900">
                {calculatePercentage(Number(campaign.raisedAmount), Number(campaign.goalAmount))}% funded
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setShowContribute(true)}
            >
              Back This Project
            </Button>
          </div>
        </div>
      )}

      {/* Contribute Modal */}
      <ContributeModal
        isOpen={showContribute}
        onClose={() => setShowContribute(false)}
        campaignId={campaign.id}
        campaignTitle={campaign.title}
        onSuccess={handleContributeSuccess}
      />
    </div>
  );
}

export { CampaignDetail };
export type { CampaignDetailProps };
