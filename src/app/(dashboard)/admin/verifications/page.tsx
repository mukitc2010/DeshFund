"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { LoadingState } from "@/components/shared/LoadingState";
import type { VerificationStatus } from "@/types";
import { Check, X, ExternalLink } from "lucide-react";

interface Verification {
  id: string;
  type: string;
  status: VerificationStatus;
  documentUrl?: string;
  notes?: string;
  createdAt: string;
  user: { profile?: { displayName: string }; email: string };
}

const statusBadge: Record<VerificationStatus, BadgeVariant> = {
  PENDING: "warning",
  VERIFIED: "success",
  REJECTED: "danger",
};

const statusTabs = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function AdminVerifications() {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [reviewModal, setReviewModal] = useState<{ verification: Verification; action: "verify" | "reject" } | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const pageSize = 20;

  async function fetchVerifications() {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/verifications?${params}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setVerifications(json.data.verifications);
        setTotal(json.meta?.total || 0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchVerifications(); }, [statusFilter, page]);

  async function handleReview() {
    if (!reviewModal) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/verifications/${reviewModal.verification.id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: reviewModal.action, notes: notes || undefined }),
      });
      const json = await res.json();
      if (json.success) {
        setReviewModal(null);
        setNotes("");
        fetchVerifications();
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">Verification Reviews</h1>
        <p className="text-secondary-500 mt-1">Review user verification submissions</p>
      </div>

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
        <LoadingState text="Loading verifications..." />
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Document</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Submitted</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {verifications.length === 0 && (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-secondary-400">No verifications found</td></tr>
                )}
                {verifications.map((v) => (
                  <tr key={v.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-secondary-900">{v.user?.profile?.displayName || "N/A"}</p>
                      <p className="text-xs text-secondary-400">{v.user?.email}</p>
                    </td>
                    <td className="px-6 py-4"><Badge variant="outline" size="sm">{v.type.replace("_", " ")}</Badge></td>
                    <td className="px-6 py-4"><Badge variant={statusBadge[v.status]} dot size="sm">{v.status}</Badge></td>
                    <td className="px-6 py-4">
                      {v.documentUrl ? (
                        <a href={v.documentUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary-600 hover:underline">
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-sm text-secondary-400">No document</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-secondary-500">{new Date(v.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {v.status === "PENDING" && (
                          <>
                            <Button size="sm" variant="primary" onClick={() => setReviewModal({ verification: v, action: "verify" })}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => setReviewModal({ verification: v, action: "reject" })}>
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

          {total > pageSize && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-secondary-200">
              <p className="text-sm text-secondary-500">Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
                <Button size="sm" variant="outline" disabled={page * pageSize >= total} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </div>
          )}
        </Card>
      )}

      <Modal
        isOpen={!!reviewModal}
        onClose={() => { setReviewModal(null); setNotes(""); }}
        title={reviewModal?.action === "verify" ? "Verify User" : "Reject Verification"}
      >
        <div className="space-y-4">
          <p className="text-secondary-600">
            {reviewModal?.action === "verify"
              ? `Verify ${reviewModal?.verification.type.replace("_", " ")} for ${reviewModal?.verification.user?.profile?.displayName || "this user"}?`
              : `Reject this verification request?`}
          </p>
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-secondary-300 px-3 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none"
              placeholder={reviewModal?.action === "reject" ? "Reason for rejection..." : "Optional notes..."}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => { setReviewModal(null); setNotes(""); }}>Cancel</Button>
            <Button variant={reviewModal?.action === "verify" ? "primary" : "danger"} loading={submitting} onClick={handleReview}>
              {reviewModal?.action === "verify" ? "Verify" : "Reject"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
