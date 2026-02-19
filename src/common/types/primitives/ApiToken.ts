import { type Brand, make } from "ts-brand";
import { z } from "zod";

/**
 * API token for machine-to-machine authentication
 */
export type ApiToken = Brand<string, "ApiToken">;
export const ApiToken = make<ApiToken>();

/** Zod schema: non-empty API token. */
export const ApiTokenSchema = z
  .string()
  .min(1, "API token must not be empty")
  .transform((s) => ApiToken(s));
