import { z } from "zod";

import {
  BigNumberStringSchema,
  EVMAccountAddressSchema,
  EVMContractAddressSchema,
  URLStringSchema,
} from "types/primitives";

export const x402V1AcceptedPaymentSchema = z.object({
  scheme: z.literal("exact"),
  network: z.string(),
  maxAmountRequired: BigNumberStringSchema,
  asset: EVMContractAddressSchema,
  payTo: EVMAccountAddressSchema,
  resource: URLStringSchema,
  description: z.string(),
  mimeType: z.string(),
  maxTimeoutSeconds: z.number(),
  extra: z.record(z.string(), z.string()),
});

export type X402V1AcceptedPayment = z.infer<typeof x402V1AcceptedPaymentSchema>;
