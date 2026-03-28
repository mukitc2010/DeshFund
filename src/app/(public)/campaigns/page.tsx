"use client";

import { Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CampaignFilters } from "@/components/campaign/CampaignFilters";
import { CampaignGrid } from "@/components/campaign/CampaignGrid";
import { Pagination } from "@/components/shared/Pagination";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useDebounce } from "@/hooks/useDebounce";

function CampaignsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "recent";

  const debouncedSearch = useDebounce(search, 0);

  const { campaigns, loading, totalPages } = useCampaigns({
    page,
    search: debouncedSearch,
    category: category || undefined,
    sort,
  });

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      if (!("page" in updates)) {
        params.delete("page");
      }
      router.push(`/campaigns?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">
          Explore Campaigns
        </h1>
        <p className="mt-2 text-base text-secondary-500">
          Discover and support innovative projects from Bangladesh
        </p>
      </div>

      <div className="mb-8">
        <CampaignFilters
          search={search}
          category={category}
          sort={sort}
          onSearchChange={(value) => updateParams({ search: value })}
          onCategoryChange={(value) => updateParams({ category: value })}
          onSortChange={(value) => updateParams({ sort: value })}
        />
      </div>

      <CampaignGrid campaigns={campaigns} loading={loading} />

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => updateParams({ page: String(p) })}
          />
        </div>
      )}
    </div>
  );
}

export default function CampaignsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-10">Loading...</div>}>
      <CampaignsContent />
    </Suspense>
  );
}
