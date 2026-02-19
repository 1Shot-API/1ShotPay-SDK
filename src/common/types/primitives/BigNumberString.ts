import { type Brand, make } from "ts-brand";
import { z } from "zod";

/**
 * This is a string representation of a big number. These values can be directly converted to a bigint.
 */
export type BigNumberString = Brand<string, "BigNumberString">;
export const BigNumberString = make<BigNumberString>();

/** Zod schema: string that parses as a bigint. */
export const BigNumberStringSchema = z
  .string()
  .refine(
    (s) => {
      try {
        BigInt(s);
        return true;
      } catch {
        return false;
      }
    },
    { message: "must be a string representing an integer (bigint)" },
  )
  .transform((s) => BigNumberString(s));
