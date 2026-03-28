"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { LoadingState } from "@/components/shared/LoadingState";
import type { CampaignStatus } from "@/types";
import { Eye, Check, X, Search } from "lucide-react";

interface Campaign {
  id: string;
  title: string;
  status: CampaignStatus;
  goalAmount: string;
  raisedAmount: string;
  createdAt: string;
  founder: { profile?: { displayName: string } };
}

const statusBadge: Record<CampaignStatus, BadgeVariant> = {
  DRAFT: "default",
  PENDING_REVIEW: "warning",
  APPROVED: "info",
  ACTIVE: "success",
  FUNDED: "success",
  REJECTED: "danger",
  CANCELLED: "default",
};

const statusTabs: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Pending Review", value: "PENDING_REVIEW" },
  { label: "Active", value: "ACTIVE" },
  { label: "Funded", value: "FUNDED" },
  { label: "Rejected", value: "REJECTED" },
];

function formatBDT(amount: string | number) {
  return new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(Number(amount));
}

export default function AdminCampaigns() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [reviewModal, setReviewModal] = useState<{ campaign: Campaign; action: "approve" | "reject" } | null>(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const pageSize = 20;

  async function fetchCampaigns() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (statusFilter) params.set("status", statusFilter);
      // Use the general campaigns endpoint with admin access
      const res = await fetch(`/api/campaigns?${params}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setCampaigns(json.data.campaigns);
        setTotal(json.meta?.total || 0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter, page]);

  async function handleReview() {
    if (!reviewModal) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/campaigns/${reviewModal.campaign.id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: reviewModal.action, reason: reason || undefined }),
      });
      const json = await res.json();
      if (json.success) {
        setReviewModal(null);
        setReason("");
        fetchCampaigns();
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Campaign Management</h1>
          <p className="text-secondary-500 mt-1">Review and manage all campaigns</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 flex-wrap">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? "bg-primary-600 text-white"
                : "bg-secondary-100 text-secondary-600 hover:bg-secondary-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState text="Loading campaigns..." />
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Founder</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Raised / Goal</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Date</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {campaigns.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-secondary-400">No campaigns found</td>
                  </tr>
                )}
                {campaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-secondary-900 truncate max-w-[200px]">{c.title}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-600">{c.founder?.profile?.displayName || "N/A"}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusBadge[c.status]} dot size="sm">{c.status.replace("_", " ")}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-600">
                      {formatBDT(c.raisedAmount)} / {formatBDT(c.goalAmount)}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-500">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => router.push(`/admin/campaigns/${c.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {c.status === "PENDING_REVIEW" && (
                          <>
                            <Button size="sm" variant="primary" onClick={() => setReviewModal({ campaign: c, action: "approve" })}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => setReviewModal({ campaign: c, action: "reject" })}>
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {total > pageSize && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200">
              <p className="text-sm text-secondary-500">
                Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button size="sm" variant="outline" disabled={page * pageSize >= total} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Review Modal */}
      <Modal
        isOpen={!!reviewModal}
        onClose={() => { setReviewModal(null); setReason(""); }}
        title={reviewModal?.action === "approve" ? "Approve Campaign" : "Reject Campaign"}
      >
        <div className="space-y-4">
          <p className="text-secondary-600">
            {reviewModal?.action === "approve"
              ? `Are you sure you want to approve "${reviewModal?.campaign.title}"? It will become active immediately.`
              : `Are you sure you want to reject "${reviewModal?.campaign.title}"?`}
          </p>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">
              {reviewModal?.action === "approve" ? "Notes (optional)" : "Reason"}
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
              placeholder={reviewModal?.action === "reject" ? "Provide a reason for rejection..." : "Optional notes..."}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setReviewModal(null); setReason(""); }}>Cancel</Button>
            <Button
              variant={reviewModal?.action === "approve" ? "primary" : "danger"}
              loading={submitting}
              onClick={handleReview}
            >
              {reviewModal?.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
