import { type Brand, make } from "ts-brand";

/**
 * This is a hex encoded binary data string that contains Solidity Call Data. It is prefixed with a "0x".
 */
export type JSONString = Brand<string, "JSONString">;
export const JSONString = make<JSONString>();
