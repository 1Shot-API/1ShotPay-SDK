import { z } from "zod";

import {
  BigNumberString,
  EVMAccountAddress,
  EVMContractAddress,
  URLString,
} from "types/primitives";

export const x402V1AcceptedPaymentSchema = z.object({
  scheme: z.literal("exact"),
  network: z.string(),
  maxAmountRequired: z.string().transform((s) => BigNumberString(s)),
  asset: z.string().transform((s) => EVMContractAddress(s)),
  payTo: z.string().transform((s) => EVMAccountAddress(s)),
  resource: z.string().transform((s) => URLString(s)),
  description: z.string(),
  mimeType: z.string(),
  maxTimeoutSeconds: z.number(),
  extra: z.record(z.string(), z.string()),
});

export type X402V1AcceptedPayment = z.infer<typeof x402V1AcceptedPaymentSchema>;
