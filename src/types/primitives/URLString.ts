import { type Brand, make } from "ts-brand";

/**
 * This is a complete URL string, including the protocol, domain, and path. It can include a query string.
 */
export type URLString = Brand<string, "URLString">;
export const URLString = make<URLString>();
