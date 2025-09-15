import { z } from 'zod';

export const SearchQuery = z.object({
  lat: z.number(),
  lng: z.number(),
  radiusMeters: z.number().default(5000),
  from: z.string().optional(),
  to: z.string().optional(),
  sport: z.string().optional()
});
export type SearchQuery = z.infer<typeof SearchQuery>;

export const CreateFacility = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  lat: z.number(),
  lng: z.number()
});
export type CreateFacility = z.infer<typeof CreateFacility>;

export const CreateCourt = z.object({
  facilityId: z.string(),
  sport: z.string(),
  surface: z.string().optional(),
  hourlyPrice: z.number().nonnegative()
});
export type CreateCourt = z.infer<typeof CreateCourt>;

export const HoldSlot = z.object({
  slotId: z.string(),
  userId: z.string()
});
export type HoldSlot = z.infer<typeof HoldSlot>;

export const CreateBooking = z.object({
  slotId: z.string(),
  userId: z.string(),
  amount: z.number().nonnegative()
});
export type CreateBooking = z.infer<typeof CreateBooking>;
