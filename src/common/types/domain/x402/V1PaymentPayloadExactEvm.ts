import { z } from "zod";

import { x402ERC3009AuthorizationSchema } from "types/domain/x402/ERC3009Authorization";
import { SignatureSchema } from "types/primitives";

const payloadSchema = z.object({
  signature: SignatureSchema,
  authorization: x402ERC3009AuthorizationSchema,
});

export const x402V1PaymentPayloadExactEvmSchema = z.object({
  x402Version: z.number(),
  scheme: z.literal("exact"),
  network: z.literal("base"),
  payload: payloadSchema,
});

export type X402V1PaymentPayloadExactEvm = z.infer<
  typeof x402V1PaymentPayloadExactEvmSchema
>;
