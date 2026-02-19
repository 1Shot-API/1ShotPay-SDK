import { type Brand, make } from "ts-brand";
import { z } from "zod";

/**
 * This is a v7 UUID, like "123e4567-e89b-12d3-a456-426614174000"
 */
export type PayLinkPaymentId = Brand<string, "PayLinkPaymentId">;
export const PayLinkPaymentId = make<PayLinkPaymentId>();

/** Zod schema: v7 UUID. */
export const PayLinkPaymentIdSchema = z
  .string()
  .refine((s) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s), {
    message: "must be a valid UUID",
  })
  .transform((s) => PayLinkPaymentId(s));
