import { type Brand, make } from "ts-brand";
import { z } from "zod";

/**
 * A CAIP-2 format network identifier. For example, Base mainnet is "eip155:8453".
 */
export type CAIP2Network = Brand<string, "CAIP2Network">;
export const CAIP2Network = make<CAIP2Network>();

/** Zod schema: CAIP-2 network identifier (e.g. eip155:8453). */
export const CAIP2NetworkSchema = z
  .string()
  .refine((s) => /^[^:]+:[^:]+$/.test(s) && s.length >= 3, {
    message:
      "must be a CAIP-2 chain id (namespace:reference, e.g. eip155:8453)",
  })
  .transform((s) => CAIP2Network(s));
