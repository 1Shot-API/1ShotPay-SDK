import { type Brand, make } from "ts-brand";
import { z } from "zod";

/**
 * This is an EVM ERC-712 signature, hex encoded and prefixed with 0x.
 */
export type Signature = Brand<string, "Signature">;
export const Signature = make<Signature>();

/** Zod schema: 0x-prefixed hex string (EVM signature, typically 130 hex chars). */
export const SignatureSchema = z
  .string()
  .refine((s) => /^0x[0-9a-fA-F]+$/.test(s) && s.length >= 132, {
    message: "must be 0x-prefixed hex signature (min 65 bytes)",
  })
  .transform((s) => Signature(s));
