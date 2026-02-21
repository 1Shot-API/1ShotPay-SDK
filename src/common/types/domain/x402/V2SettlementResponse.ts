import { z } from "zod";

import {
  CAIP2NetworkSchema,
  EVMAccountAddressSchema,
  TransactionHashSchema,
} from "types/primitives";

export const x402V2SettlementResponseSchema = z.object({
  success: z.boolean(),
  transaction: TransactionHashSchema.optional(),
  network: CAIP2NetworkSchema,
  payer: EVMAccountAddressSchema.optional(),
  errorReason: z.string().optional(),
});

export type X402V2SettlementResponse = z.infer<
  typeof x402V2SettlementResponseSchema
>;
