import { Brand, make } from "ts-brand";
import { z } from "zod";

// This is an amount of USD in decimal format. 1.01 = $1.01 = 1010000 USDC
export type DecimalAmount = Brand<number, "DecimalAmount">;
export const DecimalAmount = make<DecimalAmount>();

/** Zod schema: USD amount in decimal format (finite number). */
export const DecimalAmountSchema = z
  .number()
  .transform((n) => DecimalAmount(n));
