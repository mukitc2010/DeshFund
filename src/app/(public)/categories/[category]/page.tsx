"use client";

import { Suspense, useCallback } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CampaignGrid } from "@/components/campaign/CampaignGrid";
import { Pagination } from "@/components/shared/Pagination";
import { useCampaigns } from "@/hooks/useCampaigns";
import { ArrowLeft } from "lucide-react";
import { CATEGORIES } from "@/lib/validators/campaign";

function resolveCategory(slug: string): string {
  const decoded = decodeURIComponent(slug);
  // Direct match
  const direct = CATEGORIES.find(c => c === decoded);
  if (direct) return direct;
  // Slug match: "green-energy" → "Green Energy"
  const slugified = (name: string) => name.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-");
  const match = CATEGORIES.find(c => slugified(c) === decoded.toLowerCase());
  return match || decoded;
}

export default function CategoryPage() {
  return <Suspense fallback={null}><CategoryContent /></Suspense>;
}

function CategoryContent() {
  const params = useParams<{ category: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = resolveCategory(params.category);
  const page = Number(searchParams.get("page") || "1");

  const { campaigns, loading, totalPages } = useCampaigns({
    page,
    category,
  });

  const handlePageChange = useCallback(
    (p: number) => {
      const qp = new URLSearchParams(searchParams.toString());
      if (p > 1) {
        qp.set("page", String(p));
      } else {
        qp.delete("page");
      }
      const qs = qp.toString();
      router.push(`/categories/${encodeURIComponent(category)}${qs ? `?${qs}` : ""}`);
    },
    [router, searchParams, category]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link
          href="/campaigns"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-secondary-500 hover:text-secondary-700 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all campaigns
        </Link>
        <h1 className="text-3xl font-bold text-secondary-900 tracking-tight">
          {category} Campaigns
        </h1>
      </div>

      <CampaignGrid campaigns={campaigns} loading={loading} />

      {totalPages > 1 && (
        <div className="mt-10 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
