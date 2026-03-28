"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { LoadingState } from "@/components/shared/LoadingState";
import { Settings, Star, StarOff } from "lucide-react";

interface FeaturedCampaign {
  id: string;
  title: string;
  status: string;
  isFeatured: boolean;
  raisedAmount: string;
  goalAmount: string;
}

export default function AdminSettings() {
  const [platformFee, setPlatformFee] = useState("5");
  const [campaigns, setCampaigns] = useState<FeaturedCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch("/api/campaigns?pageSize=50&status=ACTIVE", { credentials: "include" });
        const json = await res.json();
        if (json.success) {
          setCampaigns(json.data.campaigns || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  async function toggleFeatured(campaignId: string, currentFeatured: boolean) {
    setTogglingId(campaignId);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isFeatured: !currentFeatured }),
      });
      const json = await res.json();
      if (json.success) {
        setCampaigns((prev) =>
          prev.map((c) => (c.id === campaignId ? { ...c, isFeatured: !currentFeatured } : c))
        );
        setMessage({ type: "success", text: `Campaign ${!currentFeatured ? "featured" : "unfeatured"} successfully` });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update campaign" });
    } finally {
      setTogglingId(null);
      setTimeout(() => setMessage(null), 3000);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Platform Settings</h1>
        <p className="text-secondary-500 mt-1">Configure platform-wide settings</p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-danger-50 text-danger-600"}`}>
          {message.text}
        </div>
      )}

      {/* Platform Fee */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary-50">
            <Settings className="h-6 w-6 text-primary-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-secondary-900">Platform Fee</h2>
            <p className="text-sm text-secondary-500 mt-1">
              The default platform fee percentage applied to new campaigns. Existing campaigns keep their configured fee.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(e.target.value)}
                  className="w-32 rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-secondary-400">%</span>
              </div>
              <Button
                variant="primary"
                size="md"
                loading={saving}
                onClick={() => {
                  setMessage({ type: "success", text: "Platform fee setting saved (note: this is a UI placeholder -- per-campaign fees are set in the database)" });
                  setTimeout(() => setMessage(null), 4000);
                }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Featured Campaigns */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-lg font-semibold text-secondary-900">Featured Campaigns</h2>
          <p className="text-sm text-secondary-500 mt-1">Toggle which active campaigns appear as featured</p>
        </div>

        {loading ? (
          <LoadingState text="Loading campaigns..." />
        ) : (
          <div className="divide-y divide-secondary-100">
            {campaigns.length === 0 && (
              <p className="px-6 py-12 text-center text-secondary-400">No active campaigns found</p>
            )}
            {campaigns.map((c) => (
              <div key={c.id} className="flex items-center justify-between px-6 py-4 hover:bg-secondary-50 transition-colors">
                <div>
                  <p className="font-medium text-secondary-900">{c.title}</p>
                  <p className="text-sm text-secondary-500">
                    {new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(Number(c.raisedAmount))} / {new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(Number(c.goalAmount))} BDT
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {c.isFeatured && <Badge variant="warning" dot size="sm">Featured</Badge>}
                  <Button
                    size="sm"
                    variant={c.isFeatured ? "outline" : "primary"}
                    loading={togglingId === c.id}
                    onClick={() => toggleFeatured(c.id, c.isFeatured)}
                    icon={c.isFeatured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                  >
                    {c.isFeatured ? "Unfeature" : "Feature"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Placeholder for future settings */}
      <Card className="border-dashed">
        <div className="text-center py-8">
          <p className="text-secondary-400 text-sm">More settings coming soon -- email templates, notification preferences, payment gateway configuration</p>
        </div>
      </Card>
    </div>
  );
}
