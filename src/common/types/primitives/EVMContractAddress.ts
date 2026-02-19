import { type Brand, make } from "ts-brand";
import { z } from "zod";

/**
 * This is a 20-byte Ethereum contract address, prefixed with "0x".
 */
export type EVMContractAddress = Brand<string, "EVMContractAddress">;
export const EVMContractAddress = make<EVMContractAddress>();

/** Zod schema: 0x-prefixed 40-char hex (20-byte EVM contract address). */
export const EVMContractAddressSchema = z
  .string()
  .refine((s) => /^0x[0-9a-fA-F]{40}$/.test(s), {
    message: "must be 0x-prefixed 40-char hex (EVM contract address)",
  })
  .transform((s) => EVMContractAddress(s));
