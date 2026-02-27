# @1shotapi/1shotpay-client-sdk

Client SDK for embedding the **1ShotPay passkey wallet** in your site via an iframe. Published as **@1shotapi/1shotpay-client-sdk**.

## Install

```bash
yarn add @1shotapi/1shotpay-client-sdk @1shotapi/1shotpay-common
```

Import shared types (e.g. `BigNumberString`, `ELocale`, `EVMAccountAddress`, `UnixTimestamp`) from `@1shotapi/1shotpay-common` when you need them.

## Quick start

```ts
import { OneShotPayClient } from "@1shotapi/1shotpay-client-sdk";
import {
  BigNumberString,
  ELocale,
  EVMAccountAddress,
  UnixTimestamp,
  USDCAmount,
} from "@1shotapi/1shotpay-common";
import { Delegation } from "@metamask/smart-accounts-kit";

const wallet = new OneShotPayClient();

await wallet.initialize("Wallet", [], ELocale.English).match(
  () => undefined,
  (err) => {
    throw err;
  },
);

wallet.show();
wallet.hide();

const result = await wallet
  .getERC3009Signature(
    "Some recipient",
    EVMAccountAddress("0x..."),
    BigNumberString("1"),
    UnixTimestamp(1715222400),
    UnixTimestamp(1715222400),
  )
  .match(
    (ok) => ok,
    (err) => {
      throw err;
    },
  );

// Get a subscription payment (delegation). Pass at least one of amountPerDay, amountPerWeek, amountPerMonth.
const delegation = await wallet
  .getSubscription(
    "Premium plan",
    "Monthly access to premium features",
    EVMAccountAddress("0x..."),
    null,
    null,
    USDCAmount("9.99"),
  )
  .match(
    (ok) => ok,
    (err) => {
      throw err;
    },
  );
```

## API overview

- **OneShotPayClient** — main class; `initialize()`, `getStatus()`, `signIn()`, `signOut()`, `getAccountAddress()`, `getERC3009Signature()`, `getSubscription()`, `getPermitSignature()`, `x402Fetch()`, `show()`, `hide()`, `getVisible()`.
- **Visibility:** `show()` / `hide()` control the iframe modal; `getVisible()` returns whether it is shown.
- **Iframe events:** `closeFrame` (user closes UI), `registrationRequired` (open registration URL in a new tab).

## Build & publish (from repo root)

```bash
yarn build              # build common + client (and server)
yarn publish:client     # build all deps + npm publish this package
```

## Scripts (inside this package)

- `yarn build` — compile to `dist/`
- `yarn typecheck` — run `tsc --noEmit`
- `yarn clean` — remove `dist/`

Depends on **@1shotapi/1shotpay-common** (`workspace:*` in the monorepo).
