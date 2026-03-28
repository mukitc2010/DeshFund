"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { LoadingState } from "@/components/shared/LoadingState";
import type { CampaignStatus } from "@/types";
import {
  ArrowLeft,
  Check,
  X,
  User,
  Calendar,
  Target,
  FileText,
  Flag,
  Shield,
} from "lucide-react";

const statusBadge: Record<CampaignStatus, BadgeVariant> = {
  DRAFT: "default",
  PENDING_REVIEW: "warning",
  APPROVED: "info",
  ACTIVE: "success",
  FUNDED: "success",
  REJECTED: "danger",
  CANCELLED: "default",
};

function formatBDT(amount: string | number) {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(Number(amount));
}

export default function AdminCampaignDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<"approve" | "reject" | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        const res = await fetch(`/api/campaigns/${id}`, { credentials: "include" });
        const json = await res.json();
        if (json.success) setCampaign(json.data.campaign);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchCampaign();
  }, [id]);

  async function handleReview() {
    if (!reviewModal) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/campaigns/${id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: reviewModal, reason: reason || undefined }),
      });
      const json = await res.json();
      if (json.success) {
        setCampaign(json.data.campaign);
        setReviewModal(null);
        setReason("");
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState text="Loading campaign details..." />;
  if (!campaign) return <div className="text-center py-16 text-secondary-400">Campaign not found</div>;

  const progress = campaign.goalAmount > 0 ? Math.min(100, (Number(campaign.raisedAmount) / Number(campaign.goalAmount)) * 100) : 0;
  const trustScore = campaign.founder?.trustScore?.score || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/campaigns")}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-secondary-900">{campaign.title}</h1>
            <Badge variant={statusBadge[campaign.status as CampaignStatus]} dot>{campaign.status.replace("_", " ")}</Badge>
          </div>
          <p className="text-secondary-500 mt-1">{campaign.tagline}</p>
        </div>
        {campaign.status === "PENDING_REVIEW" && (
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => setReviewModal("approve")} icon={<Check className="h-4 w-4" />}>Approve</Button>
            <Button variant="danger" onClick={() => setReviewModal("reject")} icon={<X className="h-4 w-4" />}>Reject</Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Info */}
          <Card>
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Campaign Details</h2>
            <div className="prose prose-secondary max-w-none text-sm">
              <p>{campaign.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-secondary-400" />
                <span className="text-secondary-500">Category:</span>
                <span className="font-medium text-secondary-700">{campaign.category}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-secondary-400" />
                <span className="text-secondary-500">Created:</span>
                <span className="font-medium text-secondary-700">{new Date(campaign.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Card>

          {/* Funding Progress */}
          <Card>
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Funding Progress</h2>
            <div className="flex items-end justify-between mb-2">
              <span className="text-2xl font-bold text-primary-600">{formatBDT(campaign.raisedAmount)}</span>
              <span className="text-secondary-500">of {formatBDT(campaign.goalAmount)}</span>
            </div>
            <div className="w-full bg-secondary-100 rounded-full h-3">
              <div className="bg-primary-500 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between mt-2 text-sm text-secondary-500">
              <span>{progress.toFixed(1)}% funded</span>
              <span>{campaign.contributorCount} contributors</span>
            </div>
          </Card>

          {/* Milestones */}
          {campaign.milestones?.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Milestones</h2>
              <div className="space-y-3">
                {campaign.milestones.map((m: any) => (
                  <div key={m.id} className="flex items-center justify-between py-2 border-b border-secondary-100 last:border-0">
                    <div>
                      <p className="font-medium text-secondary-800">{m.title}</p>
                      {m.description && <p className="text-sm text-secondary-500">{m.description}</p>}
                    </div>
                    <div className="flex items-center gap-3">
                      {m.budgetAllocation && <span className="text-sm text-secondary-500">{formatBDT(m.budgetAllocation)}</span>}
                      <Badge variant={m.status === "COMPLETED" ? "success" : m.status === "IN_PROGRESS" ? "info" : "default"} size="sm">
                        {m.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Documents */}
          {campaign.documents?.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Documents</h2>
              <div className="space-y-2">
                {campaign.documents.map((d: any) => (
                  <a
                    key={d.id}
                    href={d.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary-50 transition-colors"
                  >
                    <FileText className="h-5 w-5 text-secondary-400" />
                    <div>
                      <p className="text-sm font-medium text-secondary-700">{d.name}</p>
                      <p className="text-xs text-secondary-400">{d.type} - {d.visibility}</p>
                    </div>
                  </a>
                ))}
              </div>
            </Card>
          )}

          {/* Metrics */}
          {campaign.metrics?.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Financial Metrics</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-secondary-200">
                      <th className="text-left py-2 text-secondary-500 font-medium">Period</th>
                      <th className="text-right py-2 text-secondary-500 font-medium">Revenue</th>
                      <th className="text-right py-2 text-secondary-500 font-medium">Profit</th>
                      <th className="text-right py-2 text-secondary-500 font-medium">Customers</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaign.metrics.map((m: any) => (
                      <tr key={m.id} className="border-b border-secondary-50">
                        <td className="py-2 text-secondary-700">{m.period}</td>
                        <td className="py-2 text-right text-secondary-600">{m.revenue ? formatBDT(m.revenue) : "-"}</td>
                        <td className="py-2 text-right text-secondary-600">{m.profit ? formatBDT(m.profit) : "-"}</td>
                        <td className="py-2 text-right text-secondary-600">{m.customers ?? "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Founder Info */}
          <Card>
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Founder</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <p className="font-medium text-secondary-900">{campaign.founder?.profile?.displayName || "N/A"}</p>
                <p className="text-sm text-secondary-500">{campaign.founder?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-secondary-400" />
              <span className="text-sm text-secondary-500">Trust Score:</span>
              <div className="flex-1 bg-secondary-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${trustScore >= 70 ? "bg-emerald-500" : trustScore >= 40 ? "bg-amber-500" : "bg-danger-500"}`}
                  style={{ width: `${trustScore}%` }}
                />
              </div>
              <span className="text-sm font-medium text-secondary-700">{trustScore}/100</span>
            </div>
            {campaign.founder?.profile?.companyName && (
              <p className="text-sm text-secondary-500 mt-2">Company: {campaign.founder.profile.companyName}</p>
            )}
            {campaign.founder?.profile?.location && (
              <p className="text-sm text-secondary-500">Location: {campaign.founder.profile.location}</p>
            )}
          </Card>

          {/* Campaign Meta */}
          <Card>
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Campaign Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-500">Platform Fee</span>
                <span className="font-medium text-secondary-700">{Number(campaign.platformFee)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-500">Featured</span>
                <Badge variant={campaign.isFeatured ? "success" : "default"} size="sm">
                  {campaign.isFeatured ? "Yes" : "No"}
                </Badge>
              </div>
              {campaign.startDate && (
                <div className="flex justify-between">
                  <span className="text-secondary-500">Start Date</span>
                  <span className="text-secondary-700">{new Date(campaign.startDate).toLocaleDateString()}</span>
                </div>
              )}
              {campaign.endDate && (
                <div className="flex justify-between">
                  <span className="text-secondary-500">End Date</span>
                  <span className="text-secondary-700">{new Date(campaign.endDate).toLocaleDateString()}</span>
                </div>
              )}
              {campaign._count && (
                <>
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Contributions</span>
                    <span className="text-secondary-700">{campaign._count.contributions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-500">Comments</span>
                    <span className="text-secondary-700">{campaign._count.comments}</span>
                  </div>
                </>
              )}
            </div>
          </Card>

          {campaign.rejectionReason && (
            <Card className="border-danger-200 bg-danger-50">
              <h2 className="text-lg font-semibold text-danger-700 mb-2">Rejection Reason</h2>
              <p className="text-sm text-danger-600">{campaign.rejectionReason}</p>
            </Card>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewModal}
        onClose={() => { setReviewModal(null); setReason(""); }}
        title={reviewModal === "approve" ? "Approve Campaign" : "Reject Campaign"}
      >
        <div className="space-y-4">
          <p className="text-secondary-600">
            {reviewModal === "approve"
              ? `Approve "${campaign.title}"? It will become active immediately.`
              : `Reject "${campaign.title}"?`}
          </p>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              {reviewModal === "reject" ? "Reason" : "Notes (optional)"}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
              placeholder={reviewModal === "reject" ? "Reason for rejection..." : "Optional notes..."}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setReviewModal(null); setReason(""); }}>Cancel</Button>
            <Button variant={reviewModal === "approve" ? "primary" : "danger"} loading={submitting} onClick={handleReview}>
              {reviewModal === "approve" ? "Approve" : "Reject"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
