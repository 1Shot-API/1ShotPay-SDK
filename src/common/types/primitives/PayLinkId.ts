import { type Brand, make } from "ts-brand";

/**
 * This is a v7 UUID, like "123e4567-e89b-12d3-a456-426614174000"
 */
export type PayLinkId = Brand<string, "PayLinkId">;
export const PayLinkId = make<PayLinkId>();
