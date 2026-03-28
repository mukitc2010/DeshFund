"use client";

import React, { useState, useEffect } from "react";
import { getMockUser, getMockCampaigns } from "@/lib/mock-data";
import { useParams } from "next/navigation";
import Link from "next/link";
import { cn, formatBDT } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { CampaignCard } from "@/components/campaign/CampaignCard";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import {
  Shield,
  CheckCircle2,
  Building2,
  MapPin,
  Globe,
  Link2,
  Mail,
  ArrowLeft,
} from "lucide-react";

interface FounderProfile {
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  website: string | null;
  linkedin: string | null;
  companyName: string | null;
  companyRole: string | null;
}

interface TrustScore {
  score: number;
  kycComplete: boolean;
  revenueVerified: boolean;
  businessReg: boolean;
  badges: string[];
}

interface FounderCampaign {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  category: string;
  coverImageUrl: string | null;
  goalAmount: number;
  raisedAmount: number;
  contributorCount: number;
  status: string;
  _count: { contributions: number };
}

interface FounderData {
  id: string;
  email: string;
  role: string;
  createdAt: string;
  profile: FounderProfile | null;
  trustScore: TrustScore | null;
  campaigns: FounderCampaign[];
}

function TrustScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const strokeWidth = 5;
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
      <div className="absolute flex flex-col items-center">
        <span className="text-lg font-bold text-secondary-800">{score}</span>
        <span className="text-[9px] text-secondary-400 -mt-0.5">Trust</span>
      </div>
    </div>
  );
}

export default function FounderProfilePage() {
  const params = useParams<{ id: string }>();
  const founderId = params.id;

  const [founder, setFounder] = useState<FounderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchFounder() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/users/${founderId}/profile`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load profile");
      }
      setFounder(json.data.user);
    } catch {
      // Fallback to mock data
      const mockUser = getMockUser(founderId as string);
      if (mockUser) {
        const mockCampaigns = getMockCampaigns().filter(c => c.founderId === mockUser.id);
        setFounder({ ...mockUser, campaigns: mockCampaigns } as unknown as FounderData);
      } else {
        setError("Founder not found");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFounder();
  }, [founderId]);

  if (loading) {
    return <LoadingState text="Loading profile..." className="min-h-[60vh]" />;
  }

  if (error || !founder) {
    return (
      <ErrorState
        title="Profile not found"
        message={error || "This profile doesn't exist or has been removed."}
        onRetry={fetchFounder}
        className="min-h-[60vh]"
      />
    );
  }

  const profile = founder.profile;
  const trustScore = founder.trustScore;
  const campaigns = founder.campaigns || [];

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white border-b border-secondary-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-1.5 text-sm text-secondary-500 hover:text-secondary-700 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to campaigns
          </Link>

          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar + Trust Score */}
            <div className="flex items-center gap-5">
              <Avatar
                src={profile?.avatarUrl}
                fallback={profile?.displayName || "User"}
                size="xl"
              />
              {trustScore && <TrustScoreRing score={trustScore.score} />}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-secondary-900 mb-1">
                {profile?.displayName || "Anonymous"}
              </h1>
              {profile?.companyName && (
                <p className="text-sm text-secondary-500 mb-3">
                  {profile.companyRole && `${profile.companyRole} at `}
                  {profile.companyName}
                </p>
              )}

              {/* Trust badges */}
              {trustScore && trustScore.badges.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {trustScore.badges.map((badge) => (
                    <Badge key={badge} variant="success" size="sm" dot>
                      {badge}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Verification indicators */}
              {trustScore && (
                <div className="flex flex-wrap gap-4">
                  {trustScore.kycComplete && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <Shield className="h-3.5 w-3.5" />
                      KYC Verified
                    </span>
                  )}
                  {trustScore.businessReg && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <Building2 className="h-3.5 w-3.5" />
                      Registered Business
                    </span>
                  )}
                  {trustScore.revenueVerified && (
                    <span className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Revenue Verified
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - About */}
          <div className="w-full lg:w-80 shrink-0 space-y-5">
            {/* Bio */}
            {profile?.bio && (
              <Card padding="md">
                <h3 className="text-sm font-semibold text-secondary-800 mb-2">About</h3>
                <p className="text-sm text-secondary-600 leading-relaxed">{profile.bio}</p>
              </Card>
            )}

            {/* Contact & Links */}
            <Card padding="md">
              <h3 className="text-sm font-semibold text-secondary-800 mb-3">Details</h3>
              <div className="space-y-2.5">
                {profile?.location && (
                  <div className="flex items-center gap-2.5 text-sm text-secondary-600">
                    <MapPin className="h-4 w-4 text-secondary-400 shrink-0" />
                    {profile.location}
                  </div>
                )}
                {profile?.website && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Globe className="h-4 w-4 text-secondary-400 shrink-0" />
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
                {profile?.linkedin && (
                  <div className="flex items-center gap-2.5 text-sm">
                    <Link2 className="h-4 w-4 text-secondary-400 shrink-0" />
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
                <div className="flex items-center gap-2.5 text-sm text-secondary-600">
                  <Mail className="h-4 w-4 text-secondary-400 shrink-0" />
                  {founder.email}
                </div>
              </div>
            </Card>
          </div>

          {/* Right - Campaigns */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Campaigns
              {campaigns.length > 0 && (
                <span className="text-secondary-400 font-normal ml-2 text-base">
                  ({campaigns.length})
                </span>
              )}
            </h2>

            {campaigns.length === 0 ? (
              <Card padding="lg">
                <div className="flex flex-col items-center py-8 text-center">
                  <p className="text-sm text-secondary-500">
                    This founder has no active or funded campaigns yet.
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {campaigns.map((c) => (
                  <CampaignCard
                    key={c.id}
                    title={c.title}
                    tagline={c.tagline}
                    category={c.category}
                    coverImageUrl={c.coverImageUrl || undefined}
                    raisedAmount={Number(c.raisedAmount)}
                    goalAmount={Number(c.goalAmount)}
                    contributorCount={c.contributorCount}
                    founderName={profile?.displayName || "Founder"}
                    founderAvatarUrl={profile?.avatarUrl || undefined}
                    slug={c.id}
                    trustScore={trustScore?.score}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
