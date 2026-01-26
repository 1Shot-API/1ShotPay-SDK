# @1shotapi/1shotpay-common

Shared types and utilities for the 1ShotPay client and server SDKs. Published as **@1shotapi/1shotpay-common**.

## Install

```bash
yarn add @1shotapi/1shotpay-common
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
