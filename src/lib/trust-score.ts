import { prisma } from "@/lib/prisma";

interface TrustScoreBreakdown {
  kycComplete: boolean;
  revenueVerified: boolean;
  businessReg: boolean;
  teamListed: boolean;
  financialData: boolean;
  updatesPosted: boolean;
  docsUploaded: boolean;
}

interface TrustScoreResult {
  score: number;
  badges: string[];
  breakdown: TrustScoreBreakdown;
}

export async function calculateTrustScore(userId: string): Promise<TrustScoreResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      verifications: true,
      campaigns: {
        include: {
          metrics: true,
          documents: true,
          updates: true,
        },
      },
    },
  });

  if (!user) throw new Error("User not found");

  const kycComplete =
    user.verifications.some((v) => v.type === "KYC_BASIC" && v.status === "VERIFIED") ||
    user.verifications.some((v) => v.type === "NID" && v.status === "VERIFIED");
  const revenueVerified = user.verifications.some(
    (v) => v.type === "REVENUE_PROOF" && v.status === "VERIFIED"
  );
  const businessReg = user.verifications.some(
    (v) => v.type === "BUSINESS_REG" && v.status === "VERIFIED"
  );
  const teamListed = !!(user.profile?.companyName && user.profile?.companyRole);
  const financialData = user.campaigns.some((c) => c.metrics.length >= 3);
  const updatesPosted = user.campaigns.some((c) => c.updates.length >= 2);
  const docsUploaded = user.campaigns.some((c) => c.documents.length >= 3);

  let score = 0;
  if (kycComplete) score += 25;
  if (revenueVerified) score += 20;
  if (businessReg) score += 15;
  if (teamListed) score += 10;
  if (financialData) score += 15;
  if (updatesPosted) score += 8;
  if (docsUploaded) score += 7;

  const badges: string[] = [];
  if (kycComplete) badges.push("IDENTITY_VERIFIED");
  if (revenueVerified) badges.push("REVENUE_VERIFIED");
  if (businessReg) badges.push("BUSINESS_REGISTERED");
  if (score >= 60) badges.push("VERIFIED_FOUNDER");
  if (score >= 80) badges.push("INVESTOR_READY");

  await prisma.trustScore.upsert({
    where: { userId },
    create: {
      userId,
      score,
      kycComplete,
      revenueVerified,
      businessReg,
      teamListed,
      financialData,
      updatesPosted,
      docsUploaded,
      badges,
    },
    update: {
      score,
      kycComplete,
      revenueVerified,
      businessReg,
      teamListed,
      financialData,
      updatesPosted,
      docsUploaded,
      badges,
    },
  });

  return {
    score,
    badges,
    breakdown: {
      kycComplete,
      revenueVerified,
      businessReg,
      teamListed,
      financialData,
      updatesPosted,
      docsUploaded,
    },
  };
}

export type { TrustScoreResult, TrustScoreBreakdown };
