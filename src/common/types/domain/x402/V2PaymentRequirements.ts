import { z } from "zod";

import { x402V2AcceptedPaymentSchema } from "types/domain/x402/V2AcceptedPayment";
import { x402V2ResourceSchema } from "types/domain/x402/V2Resource";

export const x402V2PaymentRequirementsSchema = z.object({
  x402Version: z.literal(2),
  error: z.string(),
  resource: x402V2ResourceSchema,
  accepts: z.array(x402V2AcceptedPaymentSchema),
});

export type X402V2PaymentRequirements = z.infer<
  typeof x402V2PaymentRequirementsSchema
>;
