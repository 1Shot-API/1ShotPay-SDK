import { Brand, make } from "ts-brand";
import { z } from "zod";

// This is an amount of USDC, in Wei. USDC has 6 decimals, so USDCAmount(1010000) = 1.01 USDC
export type USDCAmount = Brand<number, "USDCAmount">;
export const USDCAmount = make<USDCAmount>();

/** Zod schema: USDC amount in smallest units (non-negative integer). */
export const USDCAmountSchema = z
  .number()
  .int()
  .nonnegative()
  .transform((n) => USDCAmount(n));
