"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import CampaignWizard from "@/components/campaign/CampaignWizard";
import { useAuth } from "@/context/AuthContext";
import type { ApiResponse } from "@/types";

export default function EditCampaignPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  const campaignId = params.id;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login");
      return;
    }

    // Verify ownership
    async function checkOwnership() {
      try {
        const res = await fetch(`/api/campaigns/${campaignId}`, {
          credentials: "include",
        });
        const json: ApiResponse<{ campaign: { founderId: string } }> =
          await res.json();
        if (json.success && json.data && json.data.campaign.founderId === user!.id) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          router.push("/founder/campaigns");
        }
      } catch {
        setAuthorized(false);
        router.push("/founder/campaigns");
      }
    }

    checkOwnership();
  }, [campaignId, user, authLoading, router]);

  if (authLoading || authorized === null) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!authorized) return null;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">
          Edit Campaign
        </h1>
        <p className="mt-1 text-sm text-secondary-500">
          Update your campaign details.
        </p>
      </div>
      <CampaignWizard campaignId={campaignId} />
    </div>
  );
}
