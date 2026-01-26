import { EHttpStatusCode } from "types/enum";

// Generic base error class for creating branded error types
export abstract class BaseError extends Error {
  abstract readonly errorCode: string;
  abstract readonly errorType: string;
  abstract readonly httpStatus: EHttpStatusCode;

  constructor(src: Error, errorType: string) {
    super(src.message);
    this.name = errorType;
    this.stack = src.stack;

    // Preserve the prototype chain
    Object.setPrototypeOf(this, this.constructor.prototype);
  }

  // Helper method to get error details
  getErrorDetails() {
    return {
      name: this.name,
      message: this.message,
      errorCode: this.errorCode,
      errorType: this.errorType,
      stack: this.stack,
    };
  }
}
