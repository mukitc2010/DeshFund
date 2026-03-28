import { z } from "zod";

export const metricSchema = z.object({
  period: z.string().regex(/^\d{4}-\d{2}$/, "Period must be YYYY-MM format"),
  revenue: z.number().nullable().optional(),
  profit: z.number().nullable().optional(),
  customers: z.number().int().nullable().optional(),
  users: z.number().int().nullable().optional(),
  orders: z.number().int().nullable().optional(),
  expenses: z.number().nullable().optional(),
  cashFlow: z.number().nullable().optional(),
  teamSize: z.number().int().nullable().optional(),
});

export type MetricInput = z.infer<typeof metricSchema>;
