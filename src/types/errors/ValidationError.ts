import { EHttpStatusCode } from "types/enum";
import { BaseError } from "types/errors/BaseError";

export class ValidationError extends BaseError {
  readonly errorCode = "ERR_VALIDATION" as const;
  readonly errorType = "ValidationError";
  readonly httpStatus = EHttpStatusCode.BAD_REQUEST;

  constructor(src: Error) {
    super(src, "ValidationError");
  }

  // Static factory method
  static fromError(src: Error): ValidationError {
    return new ValidationError(src);
  }

  // Static type guard method
  static isError(error: unknown): error is ValidationError {
    return error instanceof ValidationError;
  }
}
