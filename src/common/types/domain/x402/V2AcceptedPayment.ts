import { z } from "zod";

import {
  BigNumberString,
  EVMAccountAddress,
  EVMContractAddress,
} from "types/primitives";

export const x402V2AcceptedPaymentSchema = z.object({
  scheme: z.literal("exact"),
  network: z.string(),
  amount: z.string().transform((s) => BigNumberString(s)),
  asset: z.string().transform((s) => EVMContractAddress(s)),
  payTo: z.string().transform((s) => EVMAccountAddress(s)),
  maxTimeoutSeconds: z.number(),
  extra: z.record(z.string(), z.string()),
});

export type X402V2AcceptedPayment = z.infer<typeof x402V2AcceptedPaymentSchema>;
