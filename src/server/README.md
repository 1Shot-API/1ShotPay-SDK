# @1shotapi/1shotpay-server-sdk

Server-side SDK for 1ShotPay API integration. Published as **@1shotapi/1shotpay-server-sdk**.

This package is intentionally small: it focuses on creating and monitoring **Pay Links** from a trusted server environment. Treat this README as the canonical code documentation for the server integration.

## Install

```bash
yarn add @1shotapi/1shotpay-server-sdk @1shotapi/1shotpay-common
```

Import shared types (UserId, DecimalAmount, AjaxError, PayLinkId, etc.) from **@1shotapi/1shotpay-common** when you need them.

## Quick start (minimal)

```ts
import { DecimalAmount, UserId } from "@1shotapi/1shotpay-common";
import { OneShotPayServer } from "@1shotapi/1shotpay-server-sdk";

const server = new OneShotPayServer(
  UserId(process.env.ONESHOT_USER_ID ?? ""),
  process.env.ONESHOT_API_TOKEN ?? "",
);

// 1) Create a pay link
server
  .createPayLink(DecimalAmount(0.01), "Example checkout")
  // 2) Present the payLink.url to the user
  .andThen((payLink) => {
    console.log("Pay link:", payLink.url);

    // 3) Wait until it is paid (often in a background job)
    return server.waitForPayLinkPayment(payLink.id);
  })
  .match(
    (paidPayLink) => console.log("Paid!", paidPayLink),
    (err) => console.error("Payment failed:", err),
  );
```

## Integration flow (high-level)

- **Create a pay link** with `createPayLink()`. This returns an `IPayLink` which includes a hosted checkout `url`.
- **Present the link to the user** (open in a new tab, show a QR code, redirect, etc.).
- **Wait for completion** with `waitForPayLinkPayment()`. In production systems this is typically done **outside the request/response thread** (background job queue, worker process, etc.), so your HTTP route can return immediately while you continue monitoring for completion.

## Coding conventions (important)

### neverthrow (`ResultAsync`)

This codebase uses **neverthrow** to model success/error as values rather than exceptions:

- Methods generally return `ResultAsync<T, AjaxError>` rather than throwing.
- You handle outcomes using `.map(...)`, `.andThen(...)`, and `.match(okFn, errFn)`.

This makes error handling explicit and composable, and is especially useful in server integrations where you want deterministic behavior (and good logging) under failure.

### Branded Types (type-safe primitives)

The shared package (**@1shotapi/1shotpay-common**) uses **branded types** for important values (IDs, addresses, URLs, amounts, etc.). These are runtime values (strings/numbers) that are “tagged” at the type level so you don’t accidentally pass the wrong kind of string/number into APIs.

#### Example

```ts
import { EVMAccountAddress } from "@1shotapi/1shotpay-common";

// Create a branded type
const address = EVMAccountAddress("0xADDRESS");
```

You’ll see the same pattern for server integration primitives:

```ts
import {
  DecimalAmount,
  PayLinkId,
  URLString,
  UserId,
} from "@1shotapi/1shotpay-common";

const userId = UserId("123e4567-e89b-12d3-a456-426614174000");
const amount = DecimalAmount(0.01);
const payLinkId = PayLinkId("123e4567-e89b-12d3-a456-426614174000");
const mediaUrl = URLString("https://example.com/product.png");
```

### `resultAsyncToPromise()` (async/await bridge)

If you prefer `async/await` over chaining, **@1shotapi/1shotpay-common** provides `resultAsyncToPromise()` which converts a `ResultAsync<T, Error>` into a `Promise<T>` by throwing on error.

```ts
import {
  DecimalAmount,
  UserId,
  resultAsyncToPromise,
} from "@1shotapi/1shotpay-common";
import { OneShotPayServer } from "@1shotapi/1shotpay-server-sdk";

const server = new OneShotPayServer(UserId("..."), "api-token");

const payLink = await resultAsyncToPromise(
  server.createPayLink(DecimalAmount(0.01), "Async/await checkout"),
);
```

## `OneShotPayServer` (API documentation)

### What it is

`OneShotPayServer` is the main entry point for the server integration.

- **Authentication is maintained per instance**: each instance caches and refreshes its M2M JWT as needed.
- **How auth works internally**: calls exchange your `userId` + `apiToken` for a short-lived JWT (and refresh it before it expires). You generally don’t need to think about this unless you’re tuning instance lifetime.

### Construction

```ts
import { ELocale, UserId } from "@1shotapi/1shotpay-common";
import { OneShotPayServer } from "@1shotapi/1shotpay-server-sdk";

const server = new OneShotPayServer(
  UserId(process.env.ONESHOT_USER_ID ?? ""),
  process.env.ONESHOT_API_TOKEN ?? "",
  ELocale.English, // optional (default)
);
```

**Parameters**

- `userId: UserId`: your 1ShotPay user id
- `apiToken: string`: your 1ShotPay API token / client secret
- `locale?: ELocale`: used to build the hosted pay link URL (defaults to `ELocale.English`)

### `createPayLink(amount, description, options?)`

Creates a new pay link and returns it (including its hosted checkout URL).

```ts
import {
  DecimalAmount,
  UnixTimestamp,
  URLString,
  UserId,
} from "@1shotapi/1shotpay-common";
import { OneShotPayServer } from "@1shotapi/1shotpay-server-sdk";

const server = new OneShotPayServer(UserId("..."), "api-token");

server
  .createPayLink(DecimalAmount(0.03), "3Use Widget", {
    mediaUrl: URLString("https://example.com/widget.png"),
    reuseable: false,
    expirationTimestamp: UnixTimestamp(Math.floor(Date.now() / 1000) + 60 * 15),
    requestedPayerUserId: UserId("123e4567-e89b-12d3-a456-426614174000"),
    closeOnComplete: true,
  })
  .match(
    (payLink) => {
      console.log("Created pay link id:", payLink.id);
      console.log("Hosted URL:", payLink.url);
    },
    (err) => {
      console.error("createPayLink failed:", err);
    },
  );
```

**Notes**

- The returned `IPayLink` will have `.url` set to the hosted link for the locale you configured.
- `closeOnComplete: true` appends `?closeOnComplete=true` to the hosted URL (useful for embedded flows).

### `getPayLink(payLinkId)`

Fetches the current state of a pay link.

```ts
import { PayLinkId, UserId } from "@1shotapi/1shotpay-common";
import { OneShotPayServer } from "@1shotapi/1shotpay-server-sdk";

const server = new OneShotPayServer(UserId("..."), "api-token");

server.getPayLink(PayLinkId("123e4567-e89b-12d3-a456-426614174000")).match(
  (payLink) => {
    console.log("Status:", payLink.status);
    console.log("URL:", payLink.url);
  },
  (err) => console.error("getPayLink failed:", err),
);
```

### `waitForPayLinkPayment(payLinkId)`

Polls until a pay link transitions to “paid”, then returns the paid `IPayLink`.

This is useful when you want to wait for completion after presenting the hosted checkout URL to the user.

```ts
import { PayLinkId, UserId } from "@1shotapi/1shotpay-common";
import { OneShotPayServer } from "@1shotapi/1shotpay-server-sdk";

const server = new OneShotPayServer(UserId("..."), "api-token");
const payLinkId = PayLinkId("123e4567-e89b-12d3-a456-426614174000");

server.waitForPayLinkPayment(payLinkId).match(
  (paidPayLink) => console.log("Paid:", paidPayLink),
  (err) => console.error("waitForPayLinkPayment failed:", err),
);
```

**Operational guidance**

- For HTTP APIs, it’s common to call `waitForPayLinkPayment()` in a **worker** (background job / separate process) so you can return the pay link URL immediately to the client.
- If you need strict real-time completion, consider combining polling with server-side events or a job status endpoint in your app.

## Build & publish (from repo root)

```bash
yarn build              # build common + server (and client)
yarn publish:server     # build all deps + npm publish this package
```

## Scripts (inside this package)

- `yarn build` — compile to `dist/`
- `yarn typecheck` — run `tsc --noEmit`
- `yarn clean` — remove `dist/`

Depends on **@1shotapi/1shotpay-common** (`workspace:*` in the monorepo).
