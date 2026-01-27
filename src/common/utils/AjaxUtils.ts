import { ResultAsync } from "neverthrow";

import type {
  IAjaxRequestConfig,
  IAjaxRequestBody,
  IAjaxUtils,
} from "./IAjaxUtils";

import { AjaxError } from "types/errors";
import type { JsonWebToken } from "types/primitives";

function isJsonBody(
  data: IAjaxRequestBody,
): data is Record<string, unknown> | Array<Record<string, unknown>> {
  return (
    typeof data === "object" &&
    data !== null &&
    !(data instanceof ArrayBuffer) &&
    !(data instanceof Blob) &&
    !(data instanceof FormData) &&
    !(data instanceof URLSearchParams) &&
    !ArrayBuffer.isView(data) &&
    typeof (data as ReadableStream).getReader !== "function"
  );
}

function bodyToRequestInit(
  data: IAjaxRequestBody | undefined,
): Pick<RequestInit, "body" | "headers"> {
  if (data === undefined || data === null) {
    return {};
  }
  if (isJsonBody(data)) {
    return {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
  return { body: data as BodyInit };
}

/**
 * Fetch-based implementation of IAjaxUtils.
 * Uses the global fetch (browser or Node 18+).
 */
export class AjaxUtils implements IAjaxUtils {
  private defaultToken: string = "";

  public setDefaultToken(token: JsonWebToken): void {
    this.defaultToken = token as string;
  }

  public get<T>(
    url: URL | string,
    config?: IAjaxRequestConfig,
  ): ResultAsync<T, AjaxError> {
    return this.doFetch<T>(url, this.mergeConfig(config, { method: "GET" }));
  }

  public post<T>(
    url: URL | string,
    data?: IAjaxRequestBody,
    config?: IAjaxRequestConfig,
  ): ResultAsync<T, AjaxError> {
    const { body, headers } = bodyToRequestInit(data);
    const init: RequestInit = { method: "POST" };
    if (body !== undefined) init.body = body;
    if (headers !== undefined) init.headers = headers;
    return this.doFetch<T>(url, this.mergeConfig(config, init));
  }

  public put<T>(
    url: URL | string,
    data: IAjaxRequestBody,
    config?: IAjaxRequestConfig,
  ): ResultAsync<T, AjaxError> {
    const { body, headers } = bodyToRequestInit(data);
    return this.doFetch<T>(
      url,
      this.mergeConfig(config, { method: "PUT", body, headers }),
    );
  }

  public delete<T>(
    url: URL | string,
    config?: IAjaxRequestConfig,
  ): ResultAsync<T, AjaxError> {
    return this.doFetch<T>(url, this.mergeConfig(config, { method: "DELETE" }));
  }

  private mergeConfig(
    config: IAjaxRequestConfig | undefined,
    init: RequestInit,
  ): RequestInit {
    const headers = new Headers(init.headers);
    if (config?.headers) {
      const c = new Headers(config.headers);
      c.forEach((v, k) => headers.set(k, v));
    }
    if (this.defaultToken) {
      headers.set("Authorization", `Bearer ${this.defaultToken}`);
    }
    return {
      ...config,
      ...init,
      headers,
    };
  }

  private doFetch<T>(
    url: URL | string,
    init: RequestInit,
  ): ResultAsync<T, AjaxError> {
    return ResultAsync.fromPromise(
      (async (): Promise<T> => {
        const res = await fetch(url, init);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `HTTP ${res.status} ${res.statusText}${text ? `: ${text}` : ""}`,
          );
        }
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.toLowerCase().includes("application/json")) {
          return (await res.json()) as T;
        }
        return (await res.text()) as T;
      })(),
      (e) => AjaxError.fromError(e as Error),
    );
  }
}
