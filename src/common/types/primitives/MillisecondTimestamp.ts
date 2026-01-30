import { type Brand, make } from "ts-brand";

/**
 * This is a Unix timestamp, in milliseconds, the default for javascript. Not seconds, which is the default for Unix
 */
export type MillisecondTimestamp = Brand<number, "MillisecondTimestamp">;
export const MillisecondTimestamp = make<MillisecondTimestamp>();
