import { type Brand, make } from "ts-brand";

/**
 * This is a Unix timestamp, in seconds. Not milliseconds, which is the default for JavaScript.
 */
export type UnixTimestamp = Brand<number, "UnixTimestamp">;
export const UnixTimestamp = make<UnixTimestamp>();
