import { z } from "zod";

import {
  BigNumberString,
  EVMAccountAddress,
  HexString,
} from "types/primitives";

/** String that parses as a non-negative integer (e.g. "1", "1716150000"). */
const numericString = z.string().refine((s) => /^\d+$/.test(s), {
  message: "must be a numeric string (non-negative integer)",
});

/** 0x-prefixed 40-char hex (20-byte EVM address). */
const evmAddressString = z
  .string()
  .refine((s) => /^0x[0-9a-fA-F]{40}$/.test(s), {
    message: "must be 0x-prefixed 40-char hex (EVM address)",
  })
  .transform((s) => EVMAccountAddress(s));

/** String that parses as a bigint (e.g. "0", "1", "1000000000000000000"). */
const bigintString = z
  .string()
  .refine(
    (s) => {
      try {
        BigInt(s);
        return true;
      } catch {
        return false;
      }
    },
    {
      message: "must be a string representing an integer (bigint)",
    },
  )
  .transform((s) => BigNumberString(s));

/**
 * ERC-3009 transfer-with-authorization shape with validAfter/validBefore as strings
 * (for JSON payloads, e.g. x402 X-PAYMENT). Identical to IERC3009TransferWithAuthorization
 * except timestamps are string instead of number.
 */
export const x402ERC3009AuthorizationSchema = z.object({
  from: evmAddressString,
  to: evmAddressString,
  value: bigintString,
  validAfter: numericString,
  validBefore: numericString,
  nonce: z.string().transform((s) => HexString(s)),
});

export type X402ERC3009Authorization = z.infer<
  typeof x402ERC3009AuthorizationSchema
>;
