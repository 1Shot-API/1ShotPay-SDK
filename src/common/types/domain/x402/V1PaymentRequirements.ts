import { z } from "zod";

import { x402V1AcceptedPaymentSchema } from "types/domain/x402/V1AcceptedPayment";

export const x402V1PaymentRequirementsSchema = z.object({
  x402Version: z.literal(1),
  error: z.string(),
  accepts: z.array(x402V1AcceptedPaymentSchema),
});

export type X402V1PaymentRequirements = z.infer<
  typeof x402V1PaymentRequirementsSchema
>;
