import { type Brand, make } from "ts-brand";

/**
 * A blockchain transaction hash.
 */
export type TransactionHash = Brand<string, "TransactionHash">;
export const TransactionHash = make<TransactionHash>();
