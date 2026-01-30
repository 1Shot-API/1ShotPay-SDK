import { type Brand, make } from "ts-brand";

/**
 * This is a JWT, still in Base64 format.
 */
export type JsonWebToken = Brand<string, "JsonWebToken">;
export const JsonWebToken = make<JsonWebToken>();
