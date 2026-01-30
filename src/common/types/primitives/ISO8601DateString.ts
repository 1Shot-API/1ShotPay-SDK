import { type Brand, make } from "ts-brand";

/**
 * An ISO 8601 date string, in the format YYYY-MM-DDTHH:MM:SS.SSSZ
 * This is the same format as the ISO 8601 date string returned by the JavaScript Date object.
 */
export type ISO8601DateString = Brand<string, "ISO8601DateString">;
export const ISO8601DateString = make<ISO8601DateString>();
