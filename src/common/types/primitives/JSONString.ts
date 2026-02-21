import { type Brand, make } from "ts-brand";
import { z } from "zod";

/**
 * A stringified JSON object.
 */
export type JSONString = Brand<string, "JSONString">;
export const JSONString = make<JSONString>();

/** Zod schema: string that parses as JSON. */
export const JSONStringSchema = z
  .string()
  .refine((s) => { try { JSON.parse(s); return true; } catch { return false; } }, { message: "must be valid JSON" })
  .transform((s) => JSONString(s));
