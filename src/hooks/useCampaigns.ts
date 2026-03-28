"use client";

import { useState, useEffect, useCallback } from "react";
import { getMockCampaigns } from "@/lib/mock-data";

interface Campaign {
  id: string;
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

interface UseCampaignsParams {
  page?: number;
  pageSize?: number;
  category?: string;
  search?: string;
  sort?: string;
  featured?: boolean;
}

interface UseCampaignsReturn {
  campaigns: Campaign[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;
}

export function useCampaigns(params: UseCampaignsParams = {}): UseCampaignsReturn {
  const { page = 1, pageSize = 12, category, search, sort = "recent", featured } = params;

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCampaigns = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      queryParams.set("page", String(page));
      queryParams.set("pageSize", String(pageSize));
      queryParams.set("sort", sort);
      if (category) queryParams.set("category", category);
      if (search) queryParams.set("search", search);
      if (featured !== undefined) queryParams.set("featured", String(featured));

      const response = await fetch(`/api/campaigns?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch campaigns");
      }

      const data = await response.json();
      setCampaigns(data.campaigns ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 0);
    } catch {
      // Fallback to mock data when DB is unavailable
      const mock = getMockCampaigns();
      let filtered = mock;
      if (category) filtered = filtered.filter(c => c.category.toLowerCase() === category.toLowerCase());
      if (search) filtered = filtered.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.tagline.toLowerCase().includes(search.toLowerCase()));
      const mapped = filtered.map(c => ({
        id: c.id, title: c.title, tagline: c.tagline, category: c.category,
        coverImageUrl: c.coverImageUrl || undefined, raisedAmount: c.raisedAmount,
        goalAmount: c.goalAmount, contributorCount: c.contributorCount,
        founderName: c.founder.profile?.displayName || "Unknown",
        founderAvatarUrl: c.founder.profile?.avatarUrl || undefined,
        slug: c.slug, trustScore: c.founder.trustScore?.score,
      }));
      setCampaigns(mapped);
      setTotal(mapped.length);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, category, search, sort, featured]);

  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);

  return { campaigns, loading, error, page, totalPages, total };
}

export type { Campaign, UseCampaignsParams, UseCampaignsReturn };
