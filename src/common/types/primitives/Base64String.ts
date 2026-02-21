import { type Brand, make } from "ts-brand";
import { z } from "zod";

/**
 * This is base64 encoded string
 */
export type Base64String = Brand<string, "Base64String">;
export const Base64String = make<Base64String>();

/** Zod schema: base64-encoded string (A–Z, a–z, 0–9, +, /, padding =). */
export const Base64StringSchema = z
  .string()
  .refine(
    (s) => /^[A-Za-z0-9+/]+={0,2}$/.test(s) && s.length % 4 === 0,
    { message: "must be a valid base64 string" },
  )
  .transform((s) => Base64String(s));
