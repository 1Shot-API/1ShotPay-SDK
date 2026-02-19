import { type Brand, make } from "ts-brand";
import { z } from "zod";

/**
 * This is a 20-byte Ethereum account address, prefixed with "0x".
 */
export type EVMAccountAddress = Brand<string, "EVMAccountAddress">;
export const EVMAccountAddress = make<EVMAccountAddress>();

/** Zod schema: 0x-prefixed 40-char hex (20-byte EVM address). */
export const EVMAccountAddressSchema = z
  .string()
  .refine((s) => /^0x[0-9a-fA-F]{40}$/.test(s), {
    message: "must be 0x-prefixed 40-char hex (EVM address)",
  })
  .transform((s) => EVMAccountAddress(s));
