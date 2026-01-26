import { type Brand, make } from "ts-brand";

/**
 * This is a string representation of a big number. These values can be directly converted to a bigint.
 */
export type BigNumberString = Brand<string, "BigNumberString">;
export const BigNumberString = make<BigNumberString>();
