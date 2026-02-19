import { type Brand, make } from "ts-brand";
import { z } from "zod";

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

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Zod schema: username 1–128 chars, not UUID, not URL, not JSON. */
export const UsernameSchema = z
  .string()
  .min(1, "username must not be empty")
  .max(128, "username must be at most 128 characters")
  .refine((s) => !UUID_REGEX.test(s), {
    message: "username must not be a UUID",
  })
  .refine(
    (s) => {
      try {
        new URL(s);
        return false;
      } catch {
        return true;
      }
    },
    { message: "username must not be a URL" },
  )
  .refine(
    (s) => {
      try {
        JSON.parse(s);
        return false;
      } catch {
        return true;
      }
    },
    { message: "username must not be a JSON string" },
  )
  .transform((s) => Username(s));
