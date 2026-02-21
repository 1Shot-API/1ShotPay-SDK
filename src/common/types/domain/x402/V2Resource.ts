import { z } from "zod";

import { URLStringSchema } from "types/primitives";

export const x402V2ResourceSchema = z.object({
  url: URLStringSchema,
  description: z.string(),
  mimeType: z.string(),
});

export type X402V2Resource = z.infer<typeof x402V2ResourceSchema>;
