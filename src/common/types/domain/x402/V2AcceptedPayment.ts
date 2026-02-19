import { z } from "zod";

import {
  BigNumberStringSchema,
  EVMAccountAddressSchema,
  EVMContractAddressSchema,
} from "types/primitives";

export const x402V2AcceptedPaymentSchema = z.object({
  scheme: z.literal("exact"),
  network: z.string(),
  amount: BigNumberStringSchema,
  asset: EVMContractAddressSchema,
  payTo: EVMAccountAddressSchema,
  maxTimeoutSeconds: z.number(),
  extra: z.record(z.string(), z.string()),
});

export type X402V2AcceptedPayment = z.infer<typeof x402V2AcceptedPaymentSchema>;
