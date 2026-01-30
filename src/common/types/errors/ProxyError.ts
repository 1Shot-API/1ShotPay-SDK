import { EHttpStatusCode } from "types/enum";
import { BaseError } from "types/errors/BaseError";

// Branded error types to ensure they're distinguishable
export class ProxyError extends BaseError {
  readonly errorCode = "ERR_PROXY" as const;
  readonly errorType = "ProxyError";
  readonly httpStatus = EHttpStatusCode.INTERNAL_SERVER_ERROR;

  constructor(src: Error) {
    super(src, "ProxyError");
  }

  // Static factory method
  static fromError(src: Error): ProxyError {
    return new ProxyError(src);
  }

  // Static type guard method
  static isError(error: unknown): error is ProxyError {
    return error instanceof ProxyError;
  }
}
