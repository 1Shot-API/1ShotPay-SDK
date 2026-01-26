# @1shotapi/1shotpay-server-sdk

Server-side SDK for 1ShotPay API integration. Published as **@1shotapi/1shotpay-server-sdk**.

## Install

```bash
yarn add @1shotapi/1shotpay-server-sdk
```

## Contents

This package currently re-exports everything from **@1shotapi/1shotpay-common** (shared types and utilities). Server-specific APIs will be added in future releases.

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
