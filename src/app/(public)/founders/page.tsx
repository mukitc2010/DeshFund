"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { LoadingState } from "@/components/shared/LoadingState";
import { MOCK_USERS, getMockCampaigns } from "@/lib/mock-data";
import { formatBDT } from "@/lib/utils";
import { MapPin, Building2, Shield } from "lucide-react";

interface FounderDisplay {
  id: string;
  name: string;
  avatarUrl: string | null;
  company: string | null;
  role: string | null;
  location: string | null;
  bio: string | null;
  trustScore: number;
  badges: string[];
  campaignCount: number;
  totalRaised: number;
}

export default function FoundersPage() {
  const [founders, setFounders] = useState<FounderDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use mock data
    const campaigns = getMockCampaigns();
    const founderList: FounderDisplay[] = MOCK_USERS.filter(u => u.role === "FOUNDER").map(u => {
      const userCampaigns = campaigns.filter(c => c.founderId === u.id);
      return {
        id: u.id,
        name: u.profile.displayName,
        avatarUrl: u.profile.avatarUrl,
        company: u.profile.companyName,
        role: u.profile.companyRole,
        location: u.profile.location,
        bio: u.profile.bio,
        trustScore: u.trustScore.score,
        badges: u.trustScore.badges,
        campaignCount: userCampaigns.length,
        totalRaised: userCampaigns.reduce((sum, c) => sum + c.raisedAmount, 0),
      };
    });
    setFounders(founderList);
    setLoading(false);
  }, []);

  if (loading) return <LoadingState text="Loading founders..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-secondary-900 tracking-tight mb-4">
          Meet Our Founders
        </h1>
        <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
          Verified entrepreneurs building the future of Bangladesh
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {founders.map((founder) => (
          <Link key={founder.id} href={`/founders/${founder.id}`}>
            <Card hover className="h-full p-6 text-center group">
              <Avatar
                src={founder.avatarUrl || undefined}
                alt={founder.name}
                size="xl"
                fallback={founder.name}
              />
              <h3 className="text-lg font-semibold text-secondary-900 mt-4 group-hover:text-primary-600 transition-colors">
                {founder.name}
              </h3>
              {founder.company && (
                <div className="flex items-center justify-center gap-1.5 text-sm text-secondary-500 mt-1">
                  <Building2 className="h-3.5 w-3.5" />
                  {founder.company}
                </div>
              )}
              {founder.location && (
                <div className="flex items-center justify-center gap-1.5 text-sm text-secondary-400 mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {founder.location}
                </div>
              )}
              <div className="flex items-center justify-center gap-1.5 mt-3">
                <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                  <Shield className="h-3.5 w-3.5" />
                  Trust Score: {founder.trustScore}/100
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                {founder.badges.slice(0, 3).map((badge) => (
                  <Badge key={badge} variant="success" size="sm">
                    {badge.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                ))}
              </div>
              {founder.bio && (
                <p className="text-sm text-secondary-500 mt-3 line-clamp-2">{founder.bio}</p>
              )}
              <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-secondary-100">
                <div className="text-center">
                  <p className="text-lg font-semibold text-secondary-900">{founder.campaignCount}</p>
                  <p className="text-xs text-secondary-500">Campaigns</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-secondary-900">{formatBDT(founder.totalRaised)}</p>
                  <p className="text-xs text-secondary-500">Total Raised</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
