"use client";

import { useEffect, useState, useCallback } from "react";
import {
  ArrowDownToLine,
  Wallet,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import { Select } from "@/components/ui/Select";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatBDT, formatDate } from "@/lib/utils";
import type { ApiResponse, CampaignStatus, WithdrawalStatus } from "@/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Campaign {
  id: string;
  title: string;
  status: CampaignStatus;
  raisedAmount: number;
}

interface WithdrawalRow {
  id: string;
  campaignId: string;
  amount: number;
  status: WithdrawalStatus;
  provider: string | null;
  accountInfo: Record<string, string> | null;
  notes: string | null;
  createdAt: string;
  reviewedAt: string | null;
  campaign?: { id: string; title: string; slug: string } | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const WITHDRAWAL_STATUS_BADGE: Record<
  WithdrawalStatus,
  { variant: BadgeVariant; label: string }
> = {
  PENDING: { variant: "warning", label: "Pending" },
  APPROVED: { variant: "info", label: "Approved" },
  PROCESSING: { variant: "default", label: "Processing" },
  COMPLETED: { variant: "success", label: "Completed" },
  REJECTED: { variant: "danger", label: "Rejected" },
};

const PAYMENT_METHODS = [
  { label: "bKash", value: "BKASH" },
  { label: "Nagad", value: "NAGAD" },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WithdrawalsPage() {
  // Data state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRow[]>([]);
  const [availableBalances, setAvailableBalances] = useState<
    Record<string, number>
  >({});
  const [loading, setLoading] = useState(true);

  // Form state
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [accountPhone, setAccountPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const fetchData = useCallback(async () => {
    try {
      const [campaignsRes, withdrawalsRes] = await Promise.all([
        fetch("/api/campaigns?pageSize=50", { credentials: "include" }),
        fetch("/api/withdrawals?pageSize=50", { credentials: "include" }),
      ]);

      const campaignsJson: ApiResponse<{ campaigns: Campaign[] }> =
        await campaignsRes.json();
      const withdrawalsJson: ApiResponse<{ withdrawals: WithdrawalRow[] }> =
        await withdrawalsRes.json();

      const allCampaigns =
        campaignsJson.success && campaignsJson.data
          ? campaignsJson.data.campaigns
          : [];

      const allWithdrawals =
        withdrawalsJson.success && withdrawalsJson.data
          ? withdrawalsJson.data.withdrawals
          : [];

      // Calculate available balances per campaign
      const balances: Record<string, number> = {};
      for (const campaign of allCampaigns) {
        const raised = Number(campaign.raisedAmount || 0);
        const withdrawn = allWithdrawals
          .filter(
            (w) =>
              w.campaignId === campaign.id &&
              ["PENDING", "APPROVED", "PROCESSING", "COMPLETED"].includes(
                w.status
              )
          )
          .reduce((sum, w) => sum + Number(w.amount), 0);
        balances[campaign.id] = Math.max(0, raised - withdrawn);
      }

      // Only show campaigns with positive balance
      const eligibleCampaigns = allCampaigns.filter(
        (c) =>
          (c.status === "ACTIVE" || c.status === "FUNDED") &&
          (balances[c.id] ?? 0) > 0
      );

      setCampaigns(eligibleCampaigns);
      setWithdrawals(allWithdrawals);
      setAvailableBalances(balances);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ---------------------------------------------------------------------------
  // Form submission
  // ---------------------------------------------------------------------------

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!selectedCampaign || !amount || !paymentMethod || !accountPhone) {
      setFormError("Please fill in all fields.");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setFormError("Please enter a valid amount.");
      return;
    }

    const available = availableBalances[selectedCampaign] ?? 0;
    if (numAmount > available) {
      setFormError(
        `Amount exceeds available balance of ${formatBDT(available)}.`
      );
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          campaignId: selectedCampaign,
          amount: numAmount,
          provider: paymentMethod,
          accountInfo: { phone: accountPhone },
        }),
      });

      const json: ApiResponse<{ withdrawal: WithdrawalRow }> =
        await res.json();

      if (!json.success) {
        setFormError(json.error?.message || "Failed to submit withdrawal.");
        return;
      }

      setFormSuccess("Withdrawal request submitted successfully!");
      setSelectedCampaign("");
      setAmount("");
      setPaymentMethod("");
      setAccountPhone("");

      // Refresh data
      fetchData();
    } catch {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (loading) {
    return <LoadingState text="Loading withdrawals..." />;
  }

  const selectedBalance = selectedCampaign
    ? availableBalances[selectedCampaign] ?? 0
    : 0;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-secondary-900">Withdrawals</h1>
        <p className="mt-1 text-sm text-secondary-500">
          Request fund withdrawals from your campaigns.
        </p>
      </div>

      {/* Request Withdrawal Form */}
      <Card className="mb-8">
        <h2 className="text-base font-semibold text-secondary-900 mb-4 flex items-center gap-2">
          <ArrowDownToLine className="h-5 w-5 text-primary-600" />
          Request Withdrawal
        </h2>

        {campaigns.length === 0 ? (
          <p className="text-sm text-secondary-500">
            No campaigns with available balance for withdrawal.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Campaign"
                options={campaigns.map((c) => ({
                  label: `${c.title} (${formatBDT(availableBalances[c.id] ?? 0)} available)`,
                  value: c.id,
                }))}
                placeholder="Select a campaign"
                value={selectedCampaign}
                onChange={(e) => {
                  setSelectedCampaign(e.target.value);
                  setFormError(null);
                }}
              />

              <div className="w-full">
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                  Amount (BDT)
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  max={selectedBalance}
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setFormError(null);
                  }}
                  placeholder={
                    selectedCampaign
                      ? `Max: ${selectedBalance.toFixed(2)}`
                      : "Select campaign first"
                  }
                  disabled={!selectedCampaign}
                  className="block w-full rounded-lg border border-secondary-300 bg-white px-3.5 py-2 text-sm text-secondary-900 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-primary-500 focus:ring-primary-500/25 disabled:bg-secondary-50 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                {selectedCampaign && (
                  <p className="mt-1 text-xs text-secondary-500">
                    Available: {formatBDT(selectedBalance)}
                  </p>
                )}
              </div>

              <Select
                label="Payment Method"
                options={PAYMENT_METHODS}
                placeholder="Select payment method"
                value={paymentMethod}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setFormError(null);
                }}
              />

              <div className="w-full">
                <label className="block text-sm font-medium text-secondary-700 mb-1.5">
                  Account Phone Number
                </label>
                <input
                  type="tel"
                  value={accountPhone}
                  onChange={(e) => {
                    setAccountPhone(e.target.value);
                    setFormError(null);
                  }}
                  placeholder="01XXXXXXXXX"
                  className="block w-full rounded-lg border border-secondary-300 bg-white px-3.5 py-2 text-sm text-secondary-900 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-primary-500 focus:ring-primary-500/25"
                />
              </div>
            </div>

            {formError && (
              <p className="text-sm text-danger-600">{formError}</p>
            )}
            {formSuccess && (
              <p className="text-sm text-emerald-600">{formSuccess}</p>
            )}

            <Button
              type="submit"
              loading={submitting}
              disabled={!selectedCampaign || !amount || !paymentMethod || !accountPhone}
              icon={<Wallet className="h-4 w-4" />}
            >
              Submit Withdrawal Request
            </Button>
          </form>
        )}
      </Card>

      {/* Withdrawal History */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-secondary-200">
          <h2 className="text-base font-semibold text-secondary-900">
            Withdrawal History
          </h2>
        </div>

        {withdrawals.length === 0 ? (
          <EmptyState
            icon={<ArrowDownToLine className="h-10 w-10" />}
            title="No withdrawals yet"
            description="Your withdrawal requests will appear here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-secondary-200 bg-secondary-50/50">
                  <th className="text-left font-medium text-secondary-600 px-6 py-3">
                    Campaign
                  </th>
                  <th className="text-right font-medium text-secondary-600 px-4 py-3">
                    Amount
                  </th>
                  <th className="text-left font-medium text-secondary-600 px-4 py-3">
                    Status
                  </th>
                  <th className="text-left font-medium text-secondary-600 px-4 py-3 hidden sm:table-cell">
                    Requested
                  </th>
                  <th className="text-left font-medium text-secondary-600 px-6 py-3 hidden md:table-cell">
                    Reviewed
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-100">
                {withdrawals.map((w) => {
                  const statusBadge =
                    WITHDRAWAL_STATUS_BADGE[w.status] ||
                    WITHDRAWAL_STATUS_BADGE.PENDING;
                  return (
                    <tr
                      key={w.id}
                      className="hover:bg-secondary-50/50 transition-colors"
                    >
                      <td className="px-6 py-3 text-secondary-700">
                        <span className="truncate max-w-[200px] block">
                          {w.campaign?.title || "Unknown Campaign"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-secondary-900">
                        {formatBDT(Number(w.amount))}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={statusBadge.variant} dot>
                          {statusBadge.label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-secondary-500 hidden sm:table-cell">
                        {formatDate(w.createdAt)}
                      </td>
                      <td className="px-6 py-3 text-secondary-500 hidden md:table-cell">
                        {w.reviewedAt ? formatDate(w.reviewedAt) : "--"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
