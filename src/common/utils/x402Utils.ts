import { Base64String, EVMContractAddress } from "types/primitives";

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
