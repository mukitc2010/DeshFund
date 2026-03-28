export type UserRole = "FOUNDER" | "SUPPORTER" | "ADMIN";

export type CampaignStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "ACTIVE"
  | "FUNDED"
  | "REJECTED"
  | "CANCELLED";

export type ContributionStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type WithdrawalStatus = "PENDING" | "APPROVED" | "PROCESSING" | "COMPLETED" | "REJECTED";
export type DocumentVisibility = "PUBLIC" | "PRIVATE" | "INVESTORS_ONLY";
export type PaymentProvider = "BKASH" | "NAGAD" | "ROCKET" | "SSLCOMMERZ" | "CARD";
export type MilestoneStatus = "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
export type VerificationType = "NID" | "BUSINESS_REG" | "REVENUE_PROOF" | "KYC_BASIC" | "KYC_FULL";
export type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  } | null;
  meta?: {
    timestamp: string;
    page?: number;
    pageSize?: number;
    total?: number;
  };
}
