import { type Brand, make } from "ts-brand";

/**
 * A Username string. The DB supports up to 128 characters.
 * It is used to identify a user in the system.
 * It is not case sensitive and must be unique.
 * It is not null.
 * It is not empty.
 * It is not a UUID.
 * It is not a URL.
 * It is not a JSON string.
 */
export type Username = Brand<string, "Username">;
export const Username = make<Username>();
