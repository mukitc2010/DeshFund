"use client";

import React from "react";
import { useParams } from "next/navigation";
import { CampaignDetail } from "@/components/campaign/CampaignDetail";

export default function CampaignDetailPage() {
  const params = useParams<{ slug: string }>();
  const campaignId = params.slug;

  return <CampaignDetail campaignId={campaignId} />;
}
