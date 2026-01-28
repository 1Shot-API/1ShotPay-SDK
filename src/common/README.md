# @1shotapi/1shotpay-common

Shared types and utilities for the 1ShotPay client and server SDKs, and other 1ShotAPI services. Published as **@1shotapi/1shotpay-common**.

## Install

```bash
yarn add @1shotapi/1shotpay-common
```

## Coding conventions

### neverthrow (`ResultAsync`)

This package uses **neverthrow** to model success/error as values rather than exceptions:

- Functions often return `ResultAsync<T, E>` instead of throwing.
- You handle outcomes using `.map(...)`, `.andThen(...)`, and `.match(okFn, errFn)`.

This keeps error handling explicit and composable, and is shared across the client and server SDKs.

### Branded Types (type-safe primitives)

Core primitives like `UserId`, `PayLinkId`, `DecimalAmount`, `EVMAccountAddress`, `URLString`, etc. are implemented as **branded types**. At runtime they are just strings or numbers, but at the type level they are distinct so you cannot accidentally mix them.

Example:

```ts
import {
  EVMAccountAddress,
  DecimalAmount,
  PayLinkId,
  URLString,
  UserId,
} from "@1shotapi/1shotpay-common";

const userId = UserId("123e4567-e89b-12d3-a456-426614174000");
const amount = DecimalAmount(0.01);
const address = EVMAccountAddress("0xADDRESS");
const payLinkId = PayLinkId("123e4567-e89b-12d3-a456-426614174000");
const mediaUrl = URLString("https://example.com/product.png");
```

These branded constructors are simple wrappers from `ts-brand` and are the preferred way to construct values passed into other 1ShotPay/1ShotAPI APIs.

### `resultAsyncToPromise()` (async/await bridge)

If you prefer `async/await` to chaining, `resultAsyncToPromise()` converts a `ResultAsync<T, Error>` into a `Promise<T>` that throws on error:

```ts
import { resultAsyncToPromise } from "@1shotapi/1shotpay-common";

// given some ResultAsync<T, Error> value
const value = await resultAsyncToPromise(someResultAsync);
```

## Contents

- **Types:** enums, primitives (e.g. `EVMAccountAddress`, `BigNumberString`), domain models, errors
- **Utils:** `ObjectUtils`, x402 helpers (`x402ParseJsonOrBase64Json`, `x402GetChainIdFromNetwork`, etc.)

You usually depend on this package indirectly via `@1shotapi/1shotpay-client-sdk` or `@1shotapi/1shotpay-server-sdk`. Use it directly if you only need shared types/utilities.

## Build & publish (from repo root)

```bash
yarn workspace @1shotapi/1shotpay-common run build
yarn publish:common   # build + npm publish
```

## Scripts (inside this package)

- `yarn build` — compile to `dist/`
- `yarn typecheck` — run `tsc --noEmit`
- `yarn clean` — remove `dist/`
