import { EHttpStatusCode } from "types/enum";
import { BaseError } from "types/errors/BaseError";

// RetryError is used with backoffAndRetry(), when all you want to do is retry the operation but need an error
// to signal that whatever you are doing is not complete.
export class RetryError extends BaseError {
  readonly errorCode = "ERR_RETRY" as const;
  readonly errorType = "REtryError";
  readonly httpStatus = EHttpStatusCode.I_AM_A_TEAPOT;

  constructor(src: Error) {
    super(src, "RetryError");
  }

  // Static factory method
  static fromError(src: Error): RetryError {
    return new RetryError(src);
  }

  // Static type guard method
  static isError(error: unknown): error is RetryError {
    return error instanceof RetryError;
  }
}
