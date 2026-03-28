"use client";

import { CampaignCard, CampaignCardProps } from "./CampaignCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { FolderSearch } from "lucide-react";

interface CampaignGridProps {
  campaigns: CampaignCardProps[];
  loading: boolean;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl shadow-card border border-secondary-200/60 overflow-hidden">
      <Skeleton variant="rectangle" className="h-44 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton variant="text" className="h-5 w-3/4" />
        <Skeleton variant="text" className="h-4 w-full" />
        <Skeleton variant="text" className="h-4 w-5/6" />
        <Skeleton variant="rectangle" className="h-2 w-full rounded-full" />
        <div className="flex items-center justify-between pt-3 border-t border-secondary-100">
          <div className="flex items-center gap-2">
            <Skeleton variant="circle" className="h-7 w-7" />
            <Skeleton variant="text" className="h-3.5 w-20" />
          </div>
          <Skeleton variant="text" className="h-3.5 w-8" />
        </div>
      </div>
    </div>
  );
}

function CampaignGrid({ campaigns, loading }: CampaignGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!campaigns.length) {
    return (
      <EmptyState
        icon={<FolderSearch className="h-12 w-12" />}
        title="No campaigns found"
        description="Try adjusting your search or filter criteria to discover more campaigns."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.slug} {...campaign} />
      ))}
    </div>
  );
}

export { CampaignGrid };
export type { CampaignGridProps };
