import { z } from "zod";

export const CATEGORIES = [
  "Technology",
  "Social Impact",
  "Agriculture",
  "Education",
  "Healthcare",
  "E-commerce",
  "Food & Beverage",
  "Creative",
  "Manufacturing",
  "Green Energy",
  "Fintech",
  "Fashion & Lifestyle",
] as const;

export const createCampaignSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200, "Title must be at most 200 characters"),
  tagline: z.string().min(10, "Tagline must be at least 10 characters").max(300, "Tagline must be at most 300 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  category: z.enum(CATEGORIES, { message: "Invalid category" }),
  goalAmount: z.number().min(10000, "Goal amount must be at least 10,000 BDT"),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  coverImageUrl: z.string().url("Invalid cover image URL").optional(),
  videoUrl: z.string().url("Invalid video URL").optional(),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export const campaignQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(12),
  status: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  sort: z.enum(["recent", "funded", "trending"]).default("recent"),
  featured: z.coerce.boolean().optional(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type CampaignQueryInput = z.infer<typeof campaignQuerySchema>;
