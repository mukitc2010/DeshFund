"use client";

import React, { useState } from "react";
import { cn, formatBDT } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { CheckCircle, AlertCircle, Smartphone, Globe } from "lucide-react";

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
  campaignTitle: string;
  onSuccess?: () => void;
}

type PaymentMethod = "BKASH" | "NAGAD" | "SSLCOMMERZ";

interface PaymentOption {
  value: PaymentMethod;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const paymentOptions: PaymentOption[] = [
  {
    value: "BKASH",
    label: "bKash",
    icon: <Smartphone className="h-5 w-5" />,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-300 ring-pink-200",
  },
  {
    value: "NAGAD",
    label: "Nagad",
    icon: <Smartphone className="h-5 w-5" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300 ring-orange-200",
  },
  {
    value: "SSLCOMMERZ",
    label: "SSLCommerz",
    icon: <Globe className="h-5 w-5" />,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300 ring-blue-200",
  },
];

const PLATFORM_FEE_PERCENT = 5;

function ContributeModal({
  isOpen,
  onClose,
  campaignId,
  campaignTitle,
  onSuccess,
}: ContributeModalProps) {
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("BKASH");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const numericAmount = parseFloat(amount) || 0;
  const platformFee = Math.round(numericAmount * PLATFORM_FEE_PERCENT) / 100;
  const totalAmount = numericAmount;
  const isValidAmount = numericAmount >= 100;

  const presetAmounts = [500, 1000, 2500, 5000, 10000];

  async function handleSubmit() {
    if (!isValidAmount) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/contribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: numericAmount,
          paymentProvider: paymentMethod,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Contribution failed");
      }

      // If there's a payment URL (for production gateway redirect), redirect
      if (json.data?.paymentUrl) {
        window.location.href = json.data.paymentUrl;
        return;
      }

      setStatus("success");
      onSuccess?.();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  function handleClose() {
    if (status === "loading") return;
    setAmount("");
    setPaymentMethod("BKASH");
    setStatus("idle");
    setErrorMessage("");
    onClose();
  }

  // Success state
  if (status === "success") {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="sm">
        <div className="flex flex-col items-center text-center py-4">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-1.5">
            Thank you!
          </h3>
          <p className="text-sm text-secondary-500 max-w-xs mb-6">
            Your contribution of {formatBDT(numericAmount)} has been recorded.
            You are helping make &ldquo;{campaignTitle}&rdquo; a reality.
          </p>
          <Button variant="primary" onClick={handleClose} fullWidth>
            Done
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Back This Project" size="md">
      <div className="space-y-6">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Contribution Amount
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-400 font-medium text-lg">
              &#x09F3;
            </span>
            <input
              type="number"
              min={100}
              step={100}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className={cn(
                "w-full pl-10 pr-4 py-3 text-lg font-semibold rounded-lg border transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                "placeholder:font-normal placeholder:text-secondary-400",
                amount && !isValidAmount
                  ? "border-danger-300 focus:ring-danger-500/20 focus:border-danger-500"
                  : "border-secondary-300"
              )}
            />
          </div>
          {amount && !isValidAmount && (
            <p className="mt-1.5 text-xs text-danger-600">
              Minimum contribution is &#x09F3;100
            </p>
          )}

          {/* Preset amounts */}
          <div className="flex flex-wrap gap-2 mt-3">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(String(preset))}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors",
                  numericAmount === preset
                    ? "bg-primary-50 border-primary-300 text-primary-700"
                    : "bg-white border-secondary-200 text-secondary-600 hover:border-secondary-300 hover:bg-secondary-50"
                )}
              >
                {formatBDT(preset)}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-3">
            {paymentOptions.map((option) => {
              const isSelected = paymentMethod === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPaymentMethod(option.value)}
                  className={cn(
                    "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                    isSelected
                      ? cn(option.borderColor, option.bgColor, "ring-2")
                      : "border-secondary-200 bg-white hover:border-secondary-300 hover:bg-secondary-50"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      isSelected ? option.bgColor : "bg-secondary-100",
                      isSelected ? option.color : "text-secondary-500"
                    )}
                  >
                    {option.icon}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      isSelected ? option.color : "text-secondary-600"
                    )}
                  >
                    {option.label}
                  </span>
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className={cn("h-4 w-4", option.color)} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Total Summary */}
        {isValidAmount && (
          <div className="bg-secondary-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-secondary-500">Contribution</span>
              <span className="text-secondary-700 font-medium">
                {formatBDT(numericAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-secondary-500">
                Platform fee ({PLATFORM_FEE_PERCENT}%)
              </span>
              <span className="text-secondary-700 font-medium">
                {formatBDT(platformFee)}
              </span>
            </div>
            <div className="border-t border-secondary-200 pt-2 flex justify-between">
              <span className="text-sm font-semibold text-secondary-800">
                You pay
              </span>
              <span className="text-sm font-semibold text-secondary-900">
                {formatBDT(totalAmount)}
              </span>
            </div>
            <p className="text-[11px] text-secondary-400 mt-1">
              The {PLATFORM_FEE_PERCENT}% platform fee is deducted from the raised amount, not charged extra.
            </p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg bg-danger-50 border border-danger-200">
            <AlertCircle className="h-4 w-4 text-danger-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-danger-700 font-medium">{errorMessage}</p>
              <button
                onClick={handleSubmit}
                className="text-xs text-danger-600 underline underline-offset-2 mt-1 hover:text-danger-700"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Submit */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={status === "loading"}
          disabled={!isValidAmount}
          onClick={handleSubmit}
        >
          {status === "loading"
            ? "Processing..."
            : `Contribute ${isValidAmount ? formatBDT(numericAmount) : ""}`}
        </Button>
      </div>
    </Modal>
  );
}

export { ContributeModal };
export type { ContributeModalProps };
