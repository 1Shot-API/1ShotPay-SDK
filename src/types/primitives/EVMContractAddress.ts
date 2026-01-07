import { type Brand, make } from "ts-brand";

/**
 * This is a 20-byte Ethereum contract address, prefixed with "0x".
 */
export type EVMContractAddress = Brand<string, "EVMContractAddress">;
export const EVMContractAddress = make<EVMContractAddress>();
