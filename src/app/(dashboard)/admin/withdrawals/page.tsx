"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { LoadingState } from "@/components/shared/LoadingState";
import type { WithdrawalStatus } from "@/types";
import { Check, X } from "lucide-react";

interface Withdrawal {
  id: string;
  amount: string;
  status: WithdrawalStatus;
  provider?: string;
  notes?: string;
  createdAt: string;
  user: { profile?: { displayName: string } };
  campaignId: string;
}

const statusBadge: Record<WithdrawalStatus, BadgeVariant> = {
  PENDING: "warning",
  APPROVED: "info",
  PROCESSING: "info",
  COMPLETED: "success",
  REJECTED: "danger",
};

const statusTabs = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Rejected", value: "REJECTED" },
];

function formatBDT(amount: string | number) {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(Number(amount));
}

export default function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [reviewModal, setReviewModal] = useState<{ withdrawal: Withdrawal; action: "approve" | "reject" } | null>(null);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const pageSize = 20;

  async function fetchWithdrawals() {
    setLoading(true);
    try {
      // We'll fetch from a general endpoint; for now use admin transactions-style approach
      // The withdrawals don't have a list endpoint yet, so let's create a simple fetch
      const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
      if (statusFilter) params.set("status", statusFilter);
      const res = await fetch(`/api/admin/withdrawals?${params}`, { credentials: "include" });
      const json = await res.json();
      if (json.success) {
        setWithdrawals(json.data.withdrawals);
        setTotal(json.meta?.total || 0);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchWithdrawals(); }, [statusFilter, page]);

  async function handleReview() {
    if (!reviewModal) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/withdrawals/${reviewModal.withdrawal.id}/review`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: reviewModal.action, notes: notes || undefined }),
      });
      const json = await res.json();
      if (json.success) {
        setReviewModal(null);
        setNotes("");
        fetchWithdrawals();
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
        <h1 className="text-2xl font-bold text-secondary-900">Withdrawal Requests</h1>
        <p className="text-secondary-500 mt-1">Review and manage withdrawal requests</p>
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
        <LoadingState text="Loading withdrawals..." />
      ) : (
        <Card padding="none">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">User</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Campaign</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Provider</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Requested</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-secondary-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {withdrawals.length === 0 && (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-secondary-400">No withdrawal requests found</td></tr>
                )}
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-secondary-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-secondary-900">{w.user?.profile?.displayName || "N/A"}</td>
                    <td className="px-6 py-4 text-xs font-mono text-secondary-500">{w.campaignId.slice(0, 8)}...</td>
                    <td className="px-6 py-4 text-sm text-right font-medium text-secondary-900">{formatBDT(w.amount)}</td>
                    <td className="px-6 py-4"><Badge variant={statusBadge[w.status]} dot size="sm">{w.status}</Badge></td>
                    <td className="px-6 py-4 text-sm text-secondary-600">{w.provider || "-"}</td>
                    <td className="px-6 py-4 text-sm text-secondary-500">{new Date(w.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {w.status === "PENDING" && (
                          <>
                            <Button size="sm" variant="primary" onClick={() => setReviewModal({ withdrawal: w, action: "approve" })}>
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="danger" onClick={() => setReviewModal({ withdrawal: w, action: "reject" })}>
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
        title={reviewModal?.action === "approve" ? "Approve Withdrawal" : "Reject Withdrawal"}
      >
        <div className="space-y-4">
          <p className="text-secondary-600">
            {reviewModal?.action === "approve"
              ? `Approve withdrawal of ${reviewModal ? formatBDT(reviewModal.withdrawal.amount) : ""}?`
              : `Reject this withdrawal request?`}
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
            <Button variant={reviewModal?.action === "approve" ? "primary" : "danger"} loading={submitting} onClick={handleReview}>
              {reviewModal?.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
