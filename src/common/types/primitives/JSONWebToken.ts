import { type Brand, make } from "ts-brand";
import { z } from "zod";

/**
 * This is a JWT, still in Base64 format.
 */
export type JsonWebToken = Brand<string, "JsonWebToken">;
export const JsonWebToken = make<JsonWebToken>();

const JWT_REGEX = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;

/** Zod schema: JWT (three dot-separated base64url segments). */
export const JsonWebTokenSchema = z
  .string()
  .refine((s) => JWT_REGEX.test(s), { message: "must be a valid JWT" })
  .transform((s) => JsonWebToken(s));
