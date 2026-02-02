# 1ShotPay SDK monorepo

This repository is a Yarn workspace containing the 1ShotPay client SDK, server SDK, and shared common package.

| Package                           | Description                                                        |
| --------------------------------- | ------------------------------------------------------------------ |
| **@1shotapi/1shotpay-common**     | Shared types and utilities used by both client and server SDKs     |
| **@1shotapi/1shotpay-client-sdk** | Browser SDK for embedding the 1ShotPay passkey wallet in your site |
| **@1shotapi/1shotpay-server-sdk** | Server-side SDK for 1ShotPay API integration                       |

- **Live demo (Client SDK)**: `https://1shot-api.github.io/1ShotPay-SDK/`

## Install

- **Client (browser):**  
  `yarn add @1shotapi/1shotpay-client-sdk`
- **Server:**  
  `yarn add @1shotapi/1shotpay-server-sdk`
- **Shared types/utils only:**  
  `yarn add @1shotapi/1shotpay-common`

## Quick start (Client SDK)

```ts
import { OneShotPayClient } from "@1shotapi/1shotpay-client-sdk";
import {
  BigNumberString,
  ELocale,
  EVMAccountAddress,
  UnixTimestamp,
} from "@1shotapi/1shotpay-common";

const wallet = new OneShotPayClient();

// Injects the wallet iframe into <div id="Wallet" />
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
    EVMAccountAddress("0x0000000000000000000000000000000000000000"),
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
```

## Scripts (from repo root)

| Script                     | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `yarn build`               | Build all workspace packages (common → client, server)   |
| `yarn build:common`        | Build only `@1shotapi/1shotpay-common`                   |
| `yarn build:client`        | Build only `@1shotapi/1shotpay-client-sdk`               |
| `yarn build:server`        | Build only `@1shotapi/1shotpay-server-sdk`               |
| `yarn dev`                 | Run the Client SDK test app (Vite dev server)            |
| `yarn build:test`          | Build the test app (output in `docs/`)                   |
| `yarn build:test:gh-pages` | Build the test app with GitHub Pages base path           |
| `yarn typecheck`           | Type-check all workspace packages                        |
| `yarn clean`               | Remove all build outputs                                 |
| `yarn publish:common`      | Build and publish `@1shotapi/1shotpay-common` to npm     |
| `yarn publish:client`      | Build and publish `@1shotapi/1shotpay-client-sdk` to npm |
| `yarn publish:server`      | Build and publish `@1shotapi/1shotpay-server-sdk` to npm |

Publish order: publish `common` first, then `client` and/or `server` as needed.

## Local dev (test app)

```bash
yarn dev
```

The Vite test app in `src/test/` demonstrates the Client SDK and runs at `http://localhost:3300` (or the port Vite prints).

## Layout

- `src/common/` — **@1shotapi/1shotpay-common** (types, utils)
- `src/client/` — **@1shotapi/1shotpay-client-sdk** (OneShotPayClient, proxy types)
- `src/server/` — **@1shotapi/1shotpay-server-sdk** (server API; currently re-exports common)
- `src/test/` — Test app for the Client SDK (not published)

For more detail, see each package’s `README.md` under `src/common`, `src/client`, and `src/server`.
