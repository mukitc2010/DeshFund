"use client";

import CampaignWizard from "@/components/campaign/CampaignWizard";

export default function NewCampaignPage() {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">
          Create Campaign
        </h1>
        <p className="mt-1 text-sm text-secondary-500">
          Launch your campaign in a few simple steps.
        </p>
      </div>
      <CampaignWizard />
    </div>
  );
}
