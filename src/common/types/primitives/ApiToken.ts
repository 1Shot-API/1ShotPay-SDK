import { type Brand, make } from "ts-brand";

/**
 * API token for machine-to-machine authentication
 */
export type ApiToken = Brand<string, "ApiToken">;
export const ApiToken = make<ApiToken>();
