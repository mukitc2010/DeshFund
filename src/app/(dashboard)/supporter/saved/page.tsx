"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CampaignCard } from "@/components/campaign/CampaignCard";
import { Bookmark, Heart } from "lucide-react";

interface SavedCampaignItem {
  id: string;
  campaignId: string;
  campaign: {
    id: string;
    title: string;
    tagline: string;
    slug: string;
    category: string;
    coverImageUrl: string | null;
    raisedAmount: string;
    goalAmount: string;
    contributorCount: number;
    status: string;
    founder: {
      profile: {
        displayName: string;
        avatarUrl: string | null;
      } | null;
      trustScore: {
        score: number;
      } | null;
    };
  };
}

export default function SavedCampaignsPage() {
  const [saved, setSaved] = useState<SavedCampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unsaving, setUnsaving] = useState<string | null>(null);

  const fetchSaved = useCallback(async () => {
    try {
      const res = await fetch("/api/saved-campaigns");
      const data = await res.json();
      if (data.success) {
        setSaved(data.data.savedCampaigns);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  async function handleUnsave(campaignId: string) {
    setUnsaving(campaignId);
    try {
      const res = await fetch("/api/saved-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId }),
      });
      const data = await res.json();
      if (data.success && !data.data.saved) {
        setSaved((prev) => prev.filter((s) => s.campaignId !== campaignId));
      }
    } catch {
      // silently fail
    } finally {
      setUnsaving(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">
          Saved Campaigns
        </h1>
        <p className="text-secondary-500 mt-1">
          Campaigns you have bookmarked for later.
        </p>
      </div>

      {saved.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Bookmark className="h-12 w-12 text-secondary-300 mx-auto mb-3" />
            <p className="text-secondary-500 font-medium">
              No saved campaigns yet
            </p>
            <p className="text-sm text-secondary-400 mt-1">
              Browse campaigns and save the ones you are interested in.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map((s) => (
            <div key={s.id} className="relative">
              <CampaignCard
                title={s.campaign.title}
                tagline={s.campaign.tagline}
                category={s.campaign.category}
                coverImageUrl={s.campaign.coverImageUrl || undefined}
                raisedAmount={Number(s.campaign.raisedAmount)}
                goalAmount={Number(s.campaign.goalAmount)}
                contributorCount={s.campaign.contributorCount}
                founderName={
                  s.campaign.founder?.profile?.displayName || "Unknown"
                }
                founderAvatarUrl={
                  s.campaign.founder?.profile?.avatarUrl || undefined
                }
                slug={s.campaign.slug}
                trustScore={s.campaign.founder?.trustScore?.score}
              />
              <div className="absolute top-3 right-12 z-10">
                <Button
                  variant="ghost"
                  size="sm"
                  loading={unsaving === s.campaignId}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUnsave(s.campaignId);
                  }}
                  className="bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white"
                >
                  <Heart className="h-4 w-4 text-danger-500 fill-danger-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
