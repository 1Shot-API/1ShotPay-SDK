import { type Brand, make } from "ts-brand";

/**
 * This is a password, which will encrypt your private key
 */
export type AccountRecoveryPhrase = Brand<string, "AccountRecoveryPhrase">;
export const AccountRecoveryPhrase = make<AccountRecoveryPhrase>();
