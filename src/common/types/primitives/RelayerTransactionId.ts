import { type Brand, make } from "ts-brand";

/**
 * The ID of a transaction from the Relayer API.
 */
export type RelayerTransactionId = Brand<string, "RelayerTransactionId">;
export const RelayerTransactionId = make<RelayerTransactionId>();
