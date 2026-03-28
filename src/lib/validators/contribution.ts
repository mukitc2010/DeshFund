import { z } from "zod";

export const contributeSchema = z.object({
  amount: z
    .number()
    .min(100, "Minimum contribution is ৳100")
    .max(10000000, "Maximum contribution is ৳1,00,00,000"),
  paymentProvider: z.enum(["BKASH", "NAGAD", "ROCKET", "SSLCOMMERZ", "CARD"]),
});

export const withdrawalSchema = z.object({
  campaignId: z.string().min(1, "Campaign ID is required"),
  amount: z
    .number()
    .min(1, "Withdrawal amount must be positive"),
  provider: z.enum(["BKASH", "NAGAD", "ROCKET", "SSLCOMMERZ", "CARD"]).optional(),
  accountInfo: z.record(z.string(), z.unknown()).optional(),
  notes: z.string().optional(),
});
