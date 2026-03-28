"use client";

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TrustScoreBreakdown } from "@/lib/trust-score";
import {
  VerificationSubmitModal,
  type VerificationType,
} from "@/components/trust/VerificationSubmitModal";

interface VerificationChecklistProps {
  breakdown: TrustScoreBreakdown;
  userId: string;
  onVerificationSubmitted?: () => void;
}

interface ChecklistItem {
  key: keyof TrustScoreBreakdown;
  label: string;
  cta: string;
  /** If set, clicking opens the verification modal with this type */
  verificationType?: VerificationType;
  /** Fallback link for non-verification items */
  href?: string;
}

const ITEMS: ChecklistItem[] = [
  {
    key: "kycComplete",
    label: "Identity Verification (KYC)",
    cta: "Verify Identity",
    verificationType: "KYC_BASIC",
  },
  {
    key: "revenueVerified",
    label: "Revenue Proof",
    cta: "Upload Revenue Proof",
    verificationType: "REVENUE_PROOF",
  },
  {
    key: "businessReg",
    label: "Business Registration",
    cta: "Upload Business Docs",
    verificationType: "BUSINESS_REG",
  },
  {
    key: "teamListed",
    label: "Team Information",
    cta: "Complete Profile",
    href: "/dashboard/settings/profile",
  },
  {
    key: "financialData",
    label: "Financial Data (3+ periods)",
    cta: "Add Financial Data",
    href: "/dashboard/campaigns",
  },
  {
    key: "updatesPosted",
    label: "Campaign Updates (2+)",
    cta: "Post Updates",
    href: "/dashboard/campaigns",
  },
  {
    key: "docsUploaded",
    label: "Documents Uploaded (3+)",
    cta: "Upload Documents",
    href: "/dashboard/campaigns",
  },
];

function VerificationChecklist({
  breakdown,
  userId,
  onVerificationSubmitted,
}: VerificationChecklistProps) {
  const completed = ITEMS.filter((item) => breakdown[item.key]).length;
  const [modalOpen, setModalOpen] = useState(false);
  const [activeType, setActiveType] = useState<VerificationType>("KYC_BASIC");

  function openModal(type: VerificationType) {
    setActiveType(type);
    setModalOpen(true);
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-secondary-900">
            Verification Checklist
          </h3>
          <span className="text-xs font-medium text-secondary-500">
            {completed} of {ITEMS.length} completed
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-secondary-200/70 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${(completed / ITEMS.length) * 100}%` }}
          />
        </div>

        <ul className="space-y-2">
          {ITEMS.map((item) => {
            const done = breakdown[item.key];
            return (
              <li
                key={item.key}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2.5",
                  done ? "bg-emerald-50/60" : "bg-secondary-50"
                )}
              >
                <div className="flex items-center gap-2.5">
                  {done ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-secondary-300 shrink-0" />
                  )}
                  <span
                    className={cn(
                      "text-sm",
                      done
                        ? "text-secondary-600 line-through"
                        : "text-secondary-800 font-medium"
                    )}
                  >
                    {item.label}
                  </span>
                </div>
                {!done &&
                  (item.verificationType ? (
                    <button
                      type="button"
                      onClick={() => openModal(item.verificationType!)}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700 whitespace-nowrap"
                    >
                      {item.cta}
                    </button>
                  ) : (
                    <a
                      href={item.href}
                      className="text-xs font-medium text-primary-600 hover:text-primary-700 whitespace-nowrap"
                    >
                      {item.cta}
                    </a>
                  ))}
              </li>
            );
          })}
        </ul>
      </div>

      <VerificationSubmitModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => onVerificationSubmitted?.()}
        verificationType={activeType}
      />
    </>
  );
}

export { VerificationChecklist };
