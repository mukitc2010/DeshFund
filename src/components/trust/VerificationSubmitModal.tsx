"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

type VerificationType = "NID" | "BUSINESS_REG" | "REVENUE_PROOF" | "KYC_BASIC";

interface VerificationSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  verificationType: VerificationType;
}

const TYPE_CONFIG: Record<
  VerificationType,
  { title: string; description: string; placeholder: string }
> = {
  NID: {
    title: "Verify Identity (NID)",
    description: "Provide a link to your National ID photo for identity verification.",
    placeholder: "https://example.com/nid-photo.jpg",
  },
  BUSINESS_REG: {
    title: "Business Registration",
    description: "Provide a link to your business registration document.",
    placeholder: "https://example.com/business-reg.pdf",
  },
  REVENUE_PROOF: {
    title: "Revenue Proof",
    description: "Provide a link to your revenue proof document (bank statement, invoice, etc.).",
    placeholder: "https://example.com/revenue-proof.pdf",
  },
  KYC_BASIC: {
    title: "KYC Documents",
    description: "Provide a link to your KYC documents for basic verification.",
    placeholder: "https://example.com/kyc-docs.pdf",
  },
};

function VerificationSubmitModal({
  isOpen,
  onClose,
  onSuccess,
  verificationType,
}: VerificationSubmitModalProps) {
  const [documentUrl, setDocumentUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const config = TYPE_CONFIG[verificationType];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/verifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: verificationType, documentUrl }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error?.message || "Something went wrong");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        setDocumentUrl("");
        setSuccess(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) {
      setDocumentUrl("");
      setError(null);
      setSuccess(false);
      onClose();
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={config.title} size="sm">
      {success ? (
        <div className="text-center py-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-secondary-900">
            Verification submitted successfully
          </p>
          <p className="text-xs text-secondary-500 mt-1">
            Our team will review your document shortly.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-secondary-600">{config.description}</p>

          <div>
            <label
              htmlFor="document-url"
              className="block text-sm font-medium text-secondary-700 mb-1.5"
            >
              Document URL
            </label>
            <input
              id="document-url"
              type="url"
              required
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
              placeholder={config.placeholder}
              className="block w-full rounded-lg border border-secondary-300 px-3.5 py-2 text-sm text-secondary-900 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/25 focus:border-primary-500 transition-all duration-150"
            />
          </div>

          {error && (
            <p className="text-xs text-danger-600 bg-danger-50 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Submit for Review
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}

export { VerificationSubmitModal };
export type { VerificationType };
