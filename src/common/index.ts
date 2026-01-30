/**
 * @1shotapi/1shotpay-common
 *
 * Shared types and utilities for 1ShotPay client and server SDKs.
 */

import { ResultAsync } from "neverthrow";

export * from "./types/enum";
export * from "./types/primitives";
export * from "./types/domain";
export * from "./types/errors";
export * from "./types/models";
export * from "./utils/IAjaxUtils";
export * from "./utils/AjaxUtils";
export * from "./utils/ITimeUtils";
export * from "./utils/ObjectUtils";
export * from "./utils/TimeUtils";
export * from "./utils/x402Utils";

/**
 * A simple helper function to convert a ResultAsync to a promise if you prefer to use async/await syntax.
 * @param resultAsync A ResultAsync
 * @returns A promise that resolves with the value of the ResultAsync if it is ok, or rejects with the error
 */
export async function resultAsyncToPromise<T>(
  resultAsync: ResultAsync<T, Error>,
): Promise<T> {
  const result = await resultAsync;
  if (result.isErr()) {
    throw result.error;
  }
  return result.value;
}
