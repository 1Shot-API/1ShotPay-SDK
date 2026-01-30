import { type Brand, make } from "ts-brand";

/**
 * This is a 20-byte Ethereum account address, prefixed with "0x".
 */
export type EVMAccountAddress = Brand<string, "EVMAccountAddress">;
export const EVMAccountAddress = make<EVMAccountAddress>();
