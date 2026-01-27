import type { ResultAsync } from "neverthrow";

import type { AjaxError } from "types/errors";
import type { JsonWebToken } from "types/primitives";

/**
 * Request config based on fetch's RequestInit, excluding method and body.
 * Use this to pass headers, signal, credentials, etc.
 */
export type IAjaxRequestConfig = Omit<RequestInit, "method" | "body">;

/**
 * Body for POST / PUT. Can be fetch BodyInit or JSON-serializable data.
 */
export type IAjaxRequestBody =
  | BodyInit
  | Record<string, unknown>
  | Array<Record<string, unknown>>;

/**
 * Wrapper around fetch for HTTP calls. Kept abstract for testing.
 * Implementations use fetch; no Axios or extra dependencies.
 */
export interface IAjaxUtils {
  get<T>(
    url: URL | string,
    config?: IAjaxRequestConfig,
  ): ResultAsync<T, AjaxError>;
  post<T>(
    url: URL | string,
    data?: IAjaxRequestBody,
    config?: IAjaxRequestConfig,
  ): ResultAsync<T, AjaxError>;
  put<T>(
    url: URL | string,
    data: IAjaxRequestBody,
    config?: IAjaxRequestConfig,
  ): ResultAsync<T, AjaxError>;
  delete<T>(
    url: URL | string,
    config?: IAjaxRequestConfig,
  ): ResultAsync<T, AjaxError>;
  setDefaultToken(token: JsonWebToken): void;
}
