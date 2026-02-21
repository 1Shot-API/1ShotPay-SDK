import { type Brand, make } from "ts-brand";
import { z } from "zod";

/**
 * This is a Unix timestamp, in milliseconds, the default for javascript. Not seconds, which is the default for Unix
 */
export type MillisecondTimestamp = Brand<number, "MillisecondTimestamp">;
export const MillisecondTimestamp = make<MillisecondTimestamp>();

/** Zod schema: Unix timestamp in milliseconds (non-negative integer). */
export const MillisecondTimestampSchema = z
  .number()
  .int()
  .nonnegative()
  .transform((n) => MillisecondTimestamp(n));
