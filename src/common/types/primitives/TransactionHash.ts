import { type Brand, make } from "ts-brand";
import { z } from "zod";

/**
 * A blockchain transaction hash.
 */
export type TransactionHash = Brand<string, "TransactionHash">;
export const TransactionHash = make<TransactionHash>();

/** Zod schema: 0x-prefixed 64-char hex (32-byte hash). */
export const TransactionHashSchema = z
  .string()
  .refine((s) => /^0x[0-9a-f]{64}$/i.test(s), { message: "must be a 32-byte hex transaction hash" })
  .transform((s) => TransactionHash(s));
