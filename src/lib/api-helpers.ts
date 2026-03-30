import { getMockCampaigns, getMockCampaign, getMockUser, MOCK_USERS } from "@/lib/mock-data";

// Check if a Prisma error means the database is unavailable
export function isDbUnavailable(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes("econnrefused") ||
      msg.includes("database_not_available") ||
      msg.includes("can't reach database") ||
      msg.includes("connection refused") ||
      msg.includes("prisma") && msg.includes("connect") ||
      msg.includes("invalid") && msg.includes("invocation")
    );
  }
  return false;
}

// Mock API responses for when DB is unavailable
export function mockCampaignList(params: { page?: number; pageSize?: number; category?: string; search?: string; sort?: string; featured?: boolean }) {
  let campaigns = getMockCampaigns();
  const { page = 1, pageSize = 12, category, search, sort, featured } = params;

  if (category) campaigns = campaigns.filter(c => c.category.toLowerCase() === category.toLowerCase());
  if (search) campaigns = campaigns.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.tagline.toLowerCase().includes(search.toLowerCase())
  );
  if (featured) campaigns = campaigns.filter(c => c.isFeatured);

  if (sort === "funded") campaigns.sort((a, b) => b.raisedAmount - a.raisedAmount);
  else if (sort === "trending") campaigns.sort((a, b) => b.contributorCount - a.contributorCount);

  const total = campaigns.length;
  const start = (page - 1) * pageSize;
  const paged = campaigns.slice(start, start + pageSize);

  // Map to API response format
  const mapped = paged.map(c => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    tagline: c.tagline,
    category: c.category,
    coverImageUrl: c.coverImageUrl,
    goalAmount: c.goalAmount,
    raisedAmount: c.raisedAmount,
    contributorCount: c.contributorCount,
    status: c.status,
    isFeatured: c.isFeatured,
    createdAt: c.createdAt,
    founder: {
      id: c.founder.id,
      profile: {
        displayName: c.founder.profile?.displayName || "Unknown",
        avatarUrl: c.founder.profile?.avatarUrl || null,
      },
    },
    _count: { contributions: c.contributorCount },
  }));

  return {
    success: true,
    data: { campaigns: mapped },
    error: null,
    meta: {
      page, pageSize, total,
      totalPages: Math.ceil(total / pageSize),
      timestamp: new Date().toISOString(),
    },
  };
}

export function mockCampaignDetail(id: string) {
  const c = getMockCampaign(id);
  if (!c) return null;
  return { success: true, data: { campaign: c }, error: null };
}

export function mockFeatured() {
  const all = getMockCampaigns();
  const featured = all.filter(c => c.isFeatured).slice(0, 6).map(c => ({
    id: c.id, title: c.title, slug: c.slug, tagline: c.tagline, category: c.category,
    coverImageUrl: c.coverImageUrl, goalAmount: c.goalAmount, raisedAmount: c.raisedAmount,
    contributorCount: c.contributorCount, status: c.status,
    founder: { id: c.founder.id, profile: { displayName: c.founder.profile?.displayName, avatarUrl: null } },
  }));
  const recentlyFunded = all.filter(c => c.status === "FUNDED").slice(0, 4);
  return { success: true, data: { featured, recentlyFunded }, error: null };
}

export function mockSearch(q: string) {
  const results = getMockCampaigns().filter(c =>
    c.title.toLowerCase().includes(q.toLowerCase()) ||
    c.tagline.toLowerCase().includes(q.toLowerCase()) ||
    c.description.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 20).map(c => ({
    id: c.id, title: c.title, slug: c.slug, tagline: c.tagline, category: c.category,
    coverImageUrl: c.coverImageUrl, goalAmount: c.goalAmount, raisedAmount: c.raisedAmount,
    contributorCount: c.contributorCount,
    founder: { id: c.founder.id, profile: { displayName: c.founder.profile?.displayName, avatarUrl: null } },
  }));
  return { success: true, data: { campaigns: results }, error: null };
}

export function mockUserProfile(id: string) {
  const user = getMockUser(id);
  if (!user) return null;
  const campaigns = getMockCampaigns().filter(c => c.founderId === id);
  return {
    success: true,
    data: {
      user: {
        ...user,
        campaigns: campaigns.map(c => ({
          id: c.id, title: c.title, slug: c.slug, tagline: c.tagline, category: c.category,
          coverImageUrl: c.coverImageUrl, goalAmount: c.goalAmount, raisedAmount: c.raisedAmount,
          contributorCount: c.contributorCount, status: c.status,
        })),
      },
    },
    error: null,
  };
}

export function mockAdminStats() {
  const campaigns = getMockCampaigns();
  const totalRaised = campaigns.reduce((s, c) => s + c.raisedAmount, 0);
  const totalContributors = campaigns.reduce((s, c) => s + c.contributorCount, 0);
  return {
    success: true,
    data: {
      users: { total: 9, founders: 3, supporters: 5, admins: 1 },
      campaigns: { total: campaigns.length, active: campaigns.filter(c => c.status === "ACTIVE").length, funded: 0, pending: 0, rejected: 0 },
      totalRaised,
      platformFees: Math.round(totalRaised * 0.05),
      totalContributors,
      pendingReviews: 0,
      pendingWithdrawals: 0,
      pendingVerifications: 0,
      recentActivity: [],
    },
    error: null,
  };
}

export function mockTrustScore(userId: string) {
  const user = getMockUser(userId);
  if (!user) return null;
  return {
    success: true,
    data: {
      score: user.trustScore.score,
      badges: user.trustScore.badges,
      breakdown: user.trustScore,
    },
    error: null,
  };
}
