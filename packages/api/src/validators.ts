import { z } from "zod";

// Trip schemas

export const createTripSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
  budgetCents: z.number().int().nonnegative().optional(),
  currency: z.string().length(3).default("USD"),
  coverImageUrl: z.string().url().optional(),
});

export const updateTripSchema = createTripSchema.partial();

// Itinerary Day schemas

export const createDaySchema = z.object({
  dayNumber: z.number().int().positive(),
  date: z.string().date().optional(),
  notes: z.string().max(5000).optional(),
});

export const updateDaySchema = createDaySchema.partial();

// Itinerary Item schemas

export const itemTypeEnum = z.enum(["place", "activity", "food", "transport"]);

export const createItemSchema = z.object({
  title: z.string().min(1, "Title is required").max(300),
  type: itemTypeEnum,
  startTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Use HH:MM format")
    .optional(),
  endTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "Use HH:MM format")
    .optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  address: z.string().max(500).optional(),
  notes: z.string().max(5000).optional(),
  estimatedCostCents: z.number().int().nonnegative().optional(),
  sortOrder: z.number().int().default(0),
});

export const updateItemSchema = createItemSchema.partial();

// Inferred types

export type CreateTrip = z.infer<typeof createTripSchema>;
export type UpdateTrip = z.infer<typeof updateTripSchema>;
export type CreateDay = z.infer<typeof createDaySchema>;
export type UpdateDay = z.infer<typeof updateDaySchema>;
export type CreateItem = z.infer<typeof createItemSchema>;
export type UpdateItem = z.infer<typeof updateItemSchema>;
