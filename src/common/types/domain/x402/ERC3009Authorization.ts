import { z } from "zod";

import {
  BigNumberStringSchema,
  EVMAccountAddressSchema,
  HexStringSchema,
} from "types/primitives";

/** String that parses as a non-negative integer (e.g. "1", "1716150000"). */
const numericString = z.string().refine((s) => /^\d+$/.test(s), {
  message: "must be a numeric string (non-negative integer)",
});

/**
 * ERC-3009 transfer-with-authorization shape with validAfter/validBefore as strings
 * (for JSON payloads, e.g. x402 X-PAYMENT). Identical to IERC3009TransferWithAuthorization
 * except timestamps are string instead of number.
 */
export const x402ERC3009AuthorizationSchema = z.object({
  from: EVMAccountAddressSchema,
  to: EVMAccountAddressSchema,
  value: BigNumberStringSchema,
  validAfter: numericString,
  validBefore: numericString,
  nonce: HexStringSchema,
});

export type X402ERC3009Authorization = z.infer<
  typeof x402ERC3009AuthorizationSchema
>;
