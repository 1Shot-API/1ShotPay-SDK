import { type Brand, make } from "ts-brand";
import { z } from "zod";

/**
 * The ID of a transaction from the Relayer API.
 */
export type RelayerTransactionId = Brand<string, "RelayerTransactionId">;
export const RelayerTransactionId = make<RelayerTransactionId>();

/** Zod schema: UUID (Relayer transaction ID). */
export const RelayerTransactionIdSchema = z
  .string()
  .refine(
    (s) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s),
    {
      message: "must be a valid UUID",
    },
  )
  .transform((s) => RelayerTransactionId(s));
