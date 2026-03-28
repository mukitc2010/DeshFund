"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { FundingProgress } from "./FundingProgress";
import { Users, Shield } from "lucide-react";

interface CampaignCardProps {
  title: string;
  tagline: string;
  category: string;
  coverImageUrl?: string;
  raisedAmount: number;
  goalAmount: number;
  contributorCount: number;
  founderName: string;
  founderAvatarUrl?: string;
  slug: string;
  trustScore?: number;
}

const gradientCovers = [
  "from-indigo-400 via-purple-400 to-pink-400",
  "from-emerald-400 via-teal-400 to-cyan-400",
  "from-orange-400 via-rose-400 to-pink-400",
  "from-blue-400 via-indigo-400 to-violet-400",
  "from-fuchsia-400 via-pink-400 to-rose-400",
  "from-cyan-400 via-blue-400 to-indigo-400",
];

function getGradient(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradientCovers[Math.abs(hash) % gradientCovers.length];
}

function CampaignCard({
  title,
  tagline,
  category,
  coverImageUrl,
  raisedAmount,
  goalAmount,
  contributorCount,
  founderName,
  founderAvatarUrl,
  slug,
  trustScore,
}: CampaignCardProps) {
  return (
    <Link href={`/campaigns/${slug}`} className="block group">
      <div
        className={cn(
          "bg-white rounded-xl shadow-card border border-secondary-200/60 overflow-hidden",
          "transition-all duration-200 ease-in-out",
          "hover:shadow-elevated hover:-translate-y-1"
        )}
      >
        {/* Cover */}
        <div className="relative h-44 overflow-hidden">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div
              className={cn(
                "w-full h-full bg-gradient-to-br",
                getGradient(slug)
              )}
            />
          )}
          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="default" size="sm" className="bg-white/90 text-secondary-700 backdrop-blur-sm shadow-sm">
              {category}
            </Badge>
          </div>
          {/* Trust score */}
          {trustScore != null && trustScore > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm">
              <Shield className="h-3 w-3 text-emerald-600" />
              <span className="text-[11px] font-semibold text-emerald-700">
                {trustScore}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-base font-semibold text-secondary-900 leading-snug line-clamp-2 mb-1">
            {title}
          </h3>
          <p className="text-sm text-secondary-500 leading-relaxed line-clamp-2 mb-4">
            {tagline}
          </p>

          <FundingProgress
            raisedAmount={raisedAmount}
            goalAmount={goalAmount}
            className="mb-4"
          />

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-secondary-100">
            <div className="flex items-center gap-2">
              <Avatar
                src={founderAvatarUrl}
                fallback={founderName}
                size="sm"
              />
              <span className="text-sm text-secondary-600 font-medium truncate max-w-[120px]">
                {founderName}
              </span>
            </div>
            <div className="flex items-center gap-1 text-secondary-400">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">
                {contributorCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export { CampaignCard };
export type { CampaignCardProps };
