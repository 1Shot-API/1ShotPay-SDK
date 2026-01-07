import { type Brand, make } from "ts-brand";

/**
 * This is an EVM ERC-712 signature, hex encoded and prefixed with 0x.
 */
export type Signature = Brand<string, "Signature">;
export const Signature = make<Signature>();
