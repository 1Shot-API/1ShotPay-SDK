import { Brand, make } from "ts-brand";

// This is an amount of USD in decimal format. 1.01 = $1.01 = 1010000 USDC
export type DecimalAmount = Brand<number, "DecimalAmount">;
export const DecimalAmount = make<DecimalAmount>();
