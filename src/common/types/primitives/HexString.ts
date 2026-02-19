import { Brand, make } from "ts-brand";
import { z } from "zod";

// HexString is always prefixed with 0x and encoded in hex
export type HexString = Brand<string, "HexString">;
export const HexString = make<HexString>();

/** Zod schema: 0x-prefixed hex string. */
export const HexStringSchema = z
  .string()
  .refine((s) => /^0x[0-9a-fA-F]+$/.test(s), {
    message: "must be 0x-prefixed hex string",
  })
  .transform((s) => HexString(s));
