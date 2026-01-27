# 1Shot Widgets — server example

Minimal ecommerce example using **OneShotPayServer**. Shop for three comical widgets ($0.01, $0.02, $0.03), add to cart, and checkout with a 1ShotPay pay link. The server calls `createPayLink`, returns the pay URL to the frontend, and runs `waitForPayLinkPayment()` in the background, logging when the payment is completed.

## Run

From the repo root:

```bash
yarn server-example
```

Or from this directory:

```bash
yarn start
```

Then open **http://localhost:3333**.

## Env (optional)

- `PORT` — default `3333`
- `ONESHOT_USER_ID` — 1ShotPay user id (default: `example-user` for demo)
- `ONESHOT_API_TOKEN` — 1ShotPay API token (default: `example-token` for demo)

Use real values when testing against the real 1ShotPay API.

## Stack

- **Express** — HTTP server and static UI
- **In-memory** — products and cart (no DB)
- **@1shotapi/1shotpay-server-sdk** — `OneShotPayServer` for pay links and `waitForPayLinkPayment()`
