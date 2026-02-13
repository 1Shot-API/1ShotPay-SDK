import { IERC3009TransferWithAuthorization } from "types/domain";
import {
  Base64String,
  BigNumberString,
  EVMAccountAddress,
  EVMContractAddress,
  Signature,
  URLString,
} from "types/primitives";

export type X402V1PaymentRequirements = {
  x402Version: 1;
  error: string;
  accepts: X402V1AcceptedPayment[];
};

export type X402V2Resource = {
  url: URLString;
  description: string;
  mimeType: string;
};

export type X402V2PaymentRequirements = {
  x402Version: 2;
  error: string;
  resource: X402V2Resource;
  accepts: X402V2AcceptedPayment[];
};

export type X402V1AcceptedPayment = {
  scheme: "exact";
  network: string;
  maxAmountRequired: BigNumberString;
  asset: EVMContractAddress;
  payTo: EVMAccountAddress;
  resource: URLString;
  description: string;
  mimeType: string;
  maxTimeoutSeconds: number;
  extra: Record<string, string>;
};

export type X402V2AcceptedPayment = {
  scheme: "exact";
  network: string;
  amount: BigNumberString;
  asset: EVMContractAddress;
  payTo: EVMAccountAddress;
  maxTimeoutSeconds: number;
  extra: Record<string, string>;
};

/**
 * Same as T but with validAfter and validBefore as string (e.g. for JSON payloads).
 * Use for types that extend IERC3009TransferWithAuthorization when serializing.
 */
export type WithStringTimestamps<
  T extends { validAfter: unknown; validBefore: unknown },
> = Omit<T, "validAfter" | "validBefore"> & {
  validAfter: string;
  validBefore: string;
};

export type X402V1PaymentPayloadExactEvm = {
  x402Version: number;
  scheme: "exact";
  network: "base";
  payload: {
    signature: Signature;
    authorization: WithStringTimestamps<IERC3009TransferWithAuthorization>;
  };
};

/** x402 v2 X-PAYMENT payload (exact scheme, EVM). */
export type X402V2PaymentPayloadExactEvm = {
  x402Version: 2;
  accepted: X402V2AcceptedPayment;
  payload: {
    signature: Signature;
    authorization: WithStringTimestamps<IERC3009TransferWithAuthorization>;
  };
  resource: X402V2Resource;
};

export function x402ResolveRequestUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  // Request
  return input.url;
}

export function x402Base64EncodeUtf8(input: string): Base64String {
  // Browser path
  if (typeof btoa === "function") {
    return Base64String(btoa(unescape(encodeURIComponent(input))));
  }
  // Node path (best-effort)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const B = (globalThis as any).Buffer;
  if (B) {
    return Base64String(B.from(input, "utf8").toString("base64"));
  }
  throw new Error("No base64 encoder available in this environment.");
}

export function x402Base64DecodeUtf8(input: Base64String): string {
  // Browser path
  if (typeof atob === "function") {
    return decodeURIComponent(escape(atob(input)));
  }
  // Node path (best-effort)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const B = (globalThis as any).Buffer;
  if (B) {
    return B.from(input, "base64").toString("utf8");
  }
  throw new Error("No base64 decoder available in this environment.");
}

export function x402ParseJsonOrBase64Json(raw: string): unknown {
  const trimmed = raw.trim();
  // Try JSON first
  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed);
  }
  // Then try base64(JSON)
  try {
    const decoded = x402Base64DecodeUtf8(Base64String(trimmed));
    return JSON.parse(decoded);
  } catch {
    // As a last attempt, sometimes headers are quoted strings
    const unquoted = trimmed.replace(/^"+|"+$/g, "");
    if (unquoted.startsWith("{") || unquoted.startsWith("[")) {
      return JSON.parse(unquoted);
    }
    const decoded = x402Base64DecodeUtf8(Base64String(unquoted));
    return JSON.parse(decoded);
  }
}

export function x402GetChainIdFromNetwork(network: string): number | null {
  const normalized = (network ?? "").trim().toLowerCase();
  if (normalized === "base" || normalized === "base-mainnet") return 8453;
  // Expected: eip155:<chainId>
  const m = /^eip155:(\d+)$/.exec(network);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

export function x402IsUsdcOnBase(
  chainId: number,
  asset: EVMContractAddress,
): boolean {
  const a = asset.toLowerCase();
  // Base mainnet USDC
  if (chainId === 8453 && a === "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913")
    return true;
  return false;
}
