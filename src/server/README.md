# @1shotapi/1shotpay-server-sdk

Server-side SDK for 1ShotPay API integration. Published as **@1shotapi/1shotpay-server-sdk**.

## Install

```bash
yarn add @1shotapi/1shotpay-server-sdk @1shotapi/1shotpay-common
```

Import shared types (UserId, DecimalAmount, AjaxError, PayLinkId, etc.) from **@1shotapi/1shotpay-common** when you need them.

## Contents

Server-specific APIs: **OneShotPayServer**, **IOneShotPayServer**, **IPayLink**, **IPayLinkPayment**, **IPayLinkOptions**. This package does not re-export common.

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
