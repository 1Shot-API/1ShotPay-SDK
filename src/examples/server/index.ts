import "reflect-metadata";
import "dotenv/config";
import {
  DecimalAmount,
  UserId,
  type AjaxError,
} from "@1shotapi/1shotpay-common";
import { OneShotPayServer } from "@1shotapi/1shotpay-server-sdk";
import express, { type Request, type Response } from "express";

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 3333;
const USER_ID = (process.env.ONESHOT_USER_ID ?? "example-user") as string;
const API_TOKEN = process.env.ONESHOT_API_TOKEN ?? "example-token";

const products = [
  { id: "1", name: "1Use Widget", price: 0.01 },
  { id: "2", name: "2Use Widget", price: 0.02 },
  { id: "3", name: "3Use Widget", price: 0.03 },
] as const;

type CartItem = { productId: string; quantity: number };
const cart: CartItem[] = [];

function cartTotal(): number {
  return cart.reduce((sum, item) => {
    const p = products.find((x) => x.id === item.productId);
    return sum + (p ? p.price * item.quantity : 0);
  }, 0);
}

const oneShotPayServer = new OneShotPayServer(UserId(USER_ID), API_TOKEN);

app.get("/", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(getHtml());
});

app.get("/api/products", (_req: Request, res: Response) => {
  res.json(products);
});

app.get("/api/cart", (_req: Request, res: Response) => {
  const items = cart
    .map((item) => {
      const p = products.find((x) => x.id === item.productId);
      return p
        ? {
            ...item,
            name: p.name,
            price: p.price,
            subtotal: p.price * item.quantity,
          }
        : null;
    })
    .filter(Boolean);
  res.json({ items, total: cartTotal() });
});

app.post("/api/cart/add", (req: Request, res: Response) => {
  const { productId, quantity = 1 } = req.body as {
    productId?: string;
    quantity?: number;
  };
  if (!productId || !products.some((p) => p.id === productId)) {
    res.status(400).json({ error: "Invalid productId" });
    return;
  }
  const existing = cart.find((c) => c.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }
  res.json({ ok: true });
});

app.post("/api/checkout", async (_req: Request, res: Response) => {
  const total = cartTotal();
  if (total <= 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const result = await oneShotPayServer
    .createPayLink(DecimalAmount(total), "1Shot Widgets – your order", {
      closeOnComplete: true,
    })
    .map((payLink) => {
      console.log("Pay link created:", payLink);
      return payLink;
    })
    .mapErr((e) => {
      console.error("Error creating pay link:", e);
      return e;
    });

  if (result.isErr()) {
    res.status(500).json({ error: result.error.message });
    return;
  }

  const payLink = result.value;

  oneShotPayServer
    .waitForPayLinkPayment(payLink.id)
    .map(() => {
      console.log(
        "[1Shot Widgets] Payment received for pay link:",
        String(payLink.id),
      );
    })
    .mapErr((e: AjaxError) => {
      console.error("[1Shot Widgets] waitForPayLinkPayment error:", e);
      return e;
    });

  res.json({ url: payLink.url, payLinkId: String(payLink.id) });
});

function getHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>1Shot Widgets</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px; }
    h1 { margin-top: 0; }
    .product { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
    .product strong { font-size: 1.1em; }
    .product .price { color: #0a0; }
    button { padding: 8px 16px; border-radius: 6px; border: 1px solid #0a0; background: #0a0; color: #fff; cursor: pointer; font-size: 1em; }
    button:hover { background: #080; }
    button:disabled { background: #ccc; border-color: #ccc; cursor: not-allowed; }
    #cart { margin: 24px 0; padding: 16px; background: #f5f5f5; border-radius: 8px; }
    #cart h2 { margin-top: 0; }
    #cart ul { list-style: none; padding: 0; margin: 0; }
    #cart li { display: flex; justify-content: space-between; padding: 4px 0; }
    #checkout { margin-top: 12px; padding: 12px 24px; font-size: 1.1em; }
  </style>
</head>
<body>
  <h1>1Shot Widgets</h1>
  <p>Comical widgets for comical prices.</p>

  <div id="products"></div>

  <div id="cart">
    <h2>Cart</h2>
    <ul id="cartList"></ul>
    <p><strong>Total: $<span id="total">0.00</span></strong></p>
    <button id="checkout" disabled>Checkout with 1ShotPay</button>
  </div>

  <script>
    const productsEl = document.getElementById("products");
    const cartListEl = document.getElementById("cartList");
    const totalEl = document.getElementById("total");
    const checkoutBtn = document.getElementById("checkout");

    function renderProducts() {
      fetch("/api/products")
        .then((r) => r.json())
        .then((products) => {
          productsEl.innerHTML = products
            .map(
              (p) =>
                \`<div class="product" data-id="\${p.id}">
                  <div><strong>\${p.name}</strong><br><span class="price">$\${p.price.toFixed(2)}</span></div>
                  <button class="add" data-id="\${p.id}">Add to cart</button>
                </div>\`
            )
            .join("");
          productsEl.querySelectorAll("button.add").forEach((btn) => {
            btn.addEventListener("click", () => addToCart(btn.dataset.id));
          });
        });
    }

    function addToCart(productId) {
      fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      })
        .then((r) => r.json())
        .then(() => refreshCart());
    }

    function refreshCart() {
      fetch("/api/cart")
        .then((r) => r.json())
        .then((data) => {
          totalEl.textContent = data.total.toFixed(2);
          cartListEl.innerHTML = data.items
            .map((i) => \`<li>\${i.name} × \${i.quantity} — $\${i.subtotal.toFixed(2)}</li>\`)
            .join("");
          checkoutBtn.disabled = data.total <= 0;
        });
    }

    checkoutBtn.addEventListener("click", () => {
      fetch("/api/checkout", { method: "POST" })
        .then((r) => r.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
            return;
          }
          window.open(data.url, "_blank", "noopener");
        });
    });

    renderProducts();
    refreshCart();
  </script>
</body>
</html>`;
}

app.listen(PORT, () => {
  console.log(`1Shot Widgets example running at http://localhost:${PORT}`);
});
