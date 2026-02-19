import { type Brand, make } from "ts-brand";

/**
 * A stringified JSON object.
 */
export type JSONString = Brand<string, "JSONString">;
export const JSONString = make<JSONString>();
