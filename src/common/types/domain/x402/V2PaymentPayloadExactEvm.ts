import { z } from "zod";

import { x402ERC3009AuthorizationSchema } from "types/domain/x402/ERC3009Authorization";
import { x402V2AcceptedPaymentSchema } from "types/domain/x402/V2AcceptedPayment";
import { x402V2ResourceSchema } from "types/domain/x402/V2Resource";
import { Signature } from "types/primitives";

const payloadSchema = z.object({
  signature: z.string().transform((s) => Signature(s)),
  authorization: x402ERC3009AuthorizationSchema,
});

export const x402V2PaymentPayloadExactEvmSchema = z.object({
  x402Version: z.literal(2),
  accepted: x402V2AcceptedPaymentSchema,
  payload: payloadSchema,
  resource: x402V2ResourceSchema,
});

export type X402V2PaymentPayloadExactEvm = z.infer<
  typeof x402V2PaymentPayloadExactEvmSchema
>;
