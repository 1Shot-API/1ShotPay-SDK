# 1Shot Widgets — server example

Minimal ecommerce example using **OneShotPayServer**. Shop for three comical widgets ($0.01, $0.02, $0.03), add to cart, and checkout with a 1ShotPay pay link. The server calls `createPayLink`, returns the pay URL to the frontend, and runs `waitForPayLinkPayment()` in the background, logging when the payment is completed.

## Setup (.env)

This example includes a `.env.example`. Copy it to `.env` and fill in values as needed:

```bash
cp .env.example .env
```

## Commands

From the repo root:

```bash
yarn server-example
```

Or from this directory:

```bash
yarn start
```

Then open **http://localhost:3333**.

## Env vars (optional)

- `PORT` — default `3333`
- `ONESHOT_USER_ID` — 1ShotPay user id (default: `example-user` for demo)
- `ONESHOT_API_TOKEN` — 1ShotPay API token (default: `example-token` for demo)

Use real values when testing against the real 1ShotPay API.

## Integration flow (how it works)

- **Create a pay link**: When the user checks out, the server calls `createPayLink()` to create a hosted payment session.
- **Present it to the user**: The server returns the pay link URL to the frontend, which opens it for the user to complete payment.
- **Wait for completion**: After creating the link, the server can call `waitForPayLinkPayment()` to block/poll until the payment completes. In real integrations, you’ll often run this in a background job, a separate thread, or a separate process so your HTTP request can return immediately while you continue monitoring completion.

## Stack

- **Express** — HTTP server and static UI
- **In-memory** — products and cart (no DB)
- **@1shotapi/1shotpay-server-sdk** — `OneShotPayServer` for pay links and `waitForPayLinkPayment()`
