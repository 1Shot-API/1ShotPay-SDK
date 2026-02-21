import { type Brand, make } from "ts-brand";
import { z } from "zod";

/**
 * This is a complete URL string, including the protocol, domain, and path. It can include a query string.
 */
export type URLString = Brand<string, "URLString">;
export const URLString = make<URLString>();

/** Zod schema: valid URL string. */
export const URLStringSchema = z
  .string()
  .url("must be a valid URL")
  .transform((s) => URLString(s));
