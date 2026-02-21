import { OneShotPayClient } from "@1shotapi/1shotpay-client-sdk";
import type { IAuthenticationResult } from "@1shotapi/1shotpay-client-sdk";
import {
  BigNumberString,
  ELocale,
  EVMAccountAddress,
  ProxyError,
  UnixTimestamp,
  USDCAmount,
} from "@1shotapi/1shotpay-common";

const statusTextarea = document.getElementById(
  "statusTextarea",
) as HTMLTextAreaElement;
const getSignatureBtn = document.getElementById(
  "getSignatureBtn",
) as HTMLButtonElement;
const getAccountAddressBtn = document.getElementById(
  "getAccountAddressBtn",
) as HTMLButtonElement;
const toggleFrameBtn = document.getElementById(
  "toggleFrameBtn",
) as HTMLButtonElement;
const x402UrlInput = document.getElementById(
  "x402UrlInput",
) as HTMLInputElement;
const x402UrlError = document.getElementById("x402UrlError");
const x402VerbSelect = document.getElementById(
  "x402VerbSelect",
) as HTMLSelectElement;
const x402BodyRow = document.getElementById("x402BodyRow");
const x402BodyInput = document.getElementById(
  "x402BodyInput",
) as HTMLTextAreaElement;
const x402RequestBtn = document.getElementById(
  "x402RequestBtn",
) as HTMLButtonElement;
const x402ResponseSection = document.getElementById("x402ResponseSection");
const x402ResponseTextContainer = document.getElementById(
  "x402ResponseTextContainer",
);
const x402ResponseText = document.getElementById("x402ResponseText");
const x402ResponseCopyBtn = document.getElementById("x402ResponseCopyBtn");
const subName = document.getElementById("subName") as HTMLInputElement | null;
const subDescription = document.getElementById("subDescription") as HTMLInputElement | null;
const subDestinationAddress = document.getElementById("subDestinationAddress") as HTMLInputElement | null;
const subAmount = document.getElementById("subAmount") as HTMLInputElement | null;
const subPeriod = document.getElementById("subPeriod") as HTMLSelectElement | null;
const subCreateBtn = document.getElementById("subCreateBtn") as HTMLButtonElement | null;

if (
  !statusTextarea ||
  !getSignatureBtn ||
  !getAccountAddressBtn ||
  !toggleFrameBtn ||
  !x402UrlInput ||
  !x402VerbSelect ||
  !x402BodyRow ||
  !x402BodyInput ||
  !x402RequestBtn ||
  !subName ||
  !subDescription ||
  !subDestinationAddress ||
  !subAmount ||
  !subPeriod ||
  !subCreateBtn
) {
  throw new Error("Required elements not found");
}

function addStatusMessage(message: string, isError = false) {
  const timestamp = new Date().toLocaleTimeString();
  const prefix = isError ? "[ERROR]" : "[INFO]";
  const colorClass = isError ? "error" : "success";
  const logMessage = `${timestamp} ${prefix} ${message}\n`;

  statusTextarea.value += logMessage;
  statusTextarea.scrollTop = statusTextarea.scrollHeight;

  console.log(message);
}

// Create wallet proxy instance (Client SDK)
const oneShotPay = new OneShotPayClient();

// Cached status from getStatus() for Account Details modal
let cachedStatus: IAuthenticationResult | null = null;

addStatusMessage("Starting wallet initialization...");

// Initialize and get status
oneShotPay
  .initialize("Wallet", [], ELocale.English)
  .map(() => {
    addStatusMessage("Wallet initialized successfully");
    addStatusMessage("Calling getStatus()...");
  })
  .andThen(() => {
    return oneShotPay.getStatus();
  })
  .map((status) => {
    cachedStatus = status;
    addStatusMessage(
      `getStatus() successful: ${JSON.stringify(status, null, 2)}`,
    );

    // Enable the buttons now that initialization is complete
    getSignatureBtn.disabled = false;
    getAccountAddressBtn.disabled = false;
    toggleFrameBtn.disabled = false;
    x402RequestBtn.disabled = false;
    subCreateBtn.disabled = false;
    addStatusMessage("Ready! Click the button to get ERC3009 signature.");
  })
  .mapErr((error) => {
    addStatusMessage(`Error: ${error.message}`, true);
    console.error("Wallet error:", error);
  });

// Button click handler for getting signature
getSignatureBtn.addEventListener("click", () => {
  getSignatureBtn.disabled = true;
  addStatusMessage("Requesting ERC3009 signature...");

  oneShotPay
    .getERC3009Signature(
      "Test Transaction to Nobody",
      EVMAccountAddress("0x0000000000000000000000000000000000000000"),
      BigNumberString("1"),
      UnixTimestamp(1715222400),
      UnixTimestamp(1715222400),
    )
    .map((result) => {
      addStatusMessage("ERC3009 signature received.");
      getSignatureBtn.disabled = false;
      showSignatureModal(result);
    })
    .mapErr((error) => {
      addStatusMessage(`Error getting signature: ${error.message}`, true);
      console.error("Signature error:", error);
      getSignatureBtn.disabled = false;
    });
});

// Modal elements (optional)
const modalBackdrop = document.getElementById("modal-backdrop");
const modalSignature = document.getElementById("modal-signature");
const modalSignatureJsonContent = document.getElementById("modal-signature-json-content");
const modalSignatureJson = document.getElementById("modal-signature-json");
const modalX402Json = document.getElementById("modal-x402-json");
const modalX402JsonText = document.getElementById("modal-x402-json-text");
const modalX402JsonContent = document.getElementById("modal-x402-json-content");
const modalX402Image = document.getElementById("modal-x402-image");
const modalX402ImageContent = document.getElementById("modal-x402-image-content") as HTMLImageElement | null;
const modalAccount = document.getElementById("modal-account");
const modalAccountImage = document.getElementById("modal-account-image") as HTMLImageElement | null;
const modalAccountInitials = document.getElementById("modal-account-initials");
const modalAccountName = document.getElementById("modal-account-name");
const modalAccountProfile = document.getElementById("modal-account-profile");
const modalAccountAddressText = document.getElementById(
  "modal-account-address-text",
);
const modalAccountAddress = document.getElementById("modal-account-address");

function getInitials(username: string | undefined, address: string): string {
  if (username && username.length >= 2) {
    return username.slice(0, 2).toUpperCase();
  }
  return address.slice(2, 4).toUpperCase() || "0x";
}

let x402ImageObjectUrl: string | null = null;

function closeModals() {
  modalBackdrop?.classList.add("opacity-0");
  setTimeout(() => {
    modalBackdrop?.classList.add("hidden");
    modalSignature?.classList.add("hidden");
    modalX402Json?.classList.add("hidden");
    modalX402Image?.classList.add("hidden");
    modalAccount?.classList.add("hidden");
    if (x402ImageObjectUrl) {
      URL.revokeObjectURL(x402ImageObjectUrl);
      x402ImageObjectUrl = null;
    }
  }, 300);
}

function showAccountModal(userOrAddress: { username?: string; accountAddress: string; profileText?: string | null; profileImageUrl?: string | null } | string) {
  if (!modalBackdrop || !modalAccount || !modalAccountAddressText) return;
  modalSignature?.classList.add("hidden");
  modalX402Json?.classList.add("hidden");
  modalX402Image?.classList.add("hidden");

  const address = typeof userOrAddress === "string" ? userOrAddress : userOrAddress.accountAddress;
  const username = typeof userOrAddress === "string" ? undefined : userOrAddress.username;
  const profileText = typeof userOrAddress === "string" ? undefined : userOrAddress.profileText;
  const profileImageUrl = typeof userOrAddress === "string" ? undefined : userOrAddress.profileImageUrl;

  const shortAddress = address.length > 14 ? `${address.slice(0, 6)}...${address.slice(-5)}` : address;

  // Avatar: profile image or initials
  if (modalAccountImage && modalAccountInitials) {
    if (profileImageUrl) {
      modalAccountImage.src = profileImageUrl;
      modalAccountImage.alt = username ?? "Profile";
      modalAccountImage.classList.remove("hidden");
      modalAccountInitials.classList.add("hidden");
    } else {
      modalAccountImage.classList.add("hidden");
      modalAccountInitials.classList.remove("hidden");
      modalAccountInitials.textContent = getInitials(username, address);
    }
  }

  // Name
  if (modalAccountName) {
    modalAccountName.textContent = username ?? "Wallet";
  }

  // Profile text
  if (modalAccountProfile) {
    modalAccountProfile.textContent = profileText ?? "Connected via 1ShotPay SDK";
    modalAccountProfile.classList.remove("hidden");
  }

  modalAccountAddressText.textContent = shortAddress;
  modalAccountAddressText.title = address;
  modalAccountAddressText.dataset.fullAddress = address;

  modalBackdrop.classList.remove("hidden");
  modalBackdrop.classList.remove("opacity-0");
  modalAccount.classList.remove("hidden");
  (window as unknown as { lucide?: { createIcons: () => void } }).lucide?.createIcons?.();
}

function showSignatureModal(payload: object) {
  if (!modalBackdrop || !modalSignature || !modalSignatureJsonContent || !modalSignatureJson) return;
  modalX402Json?.classList.add("hidden");
  modalX402Image?.classList.add("hidden");
  const jsonStr = JSON.stringify(payload, null, 2);
  modalSignatureJsonContent.textContent = jsonStr;
  modalSignatureJson.dataset.json = jsonStr;
  modalAccount?.classList.add("hidden");
  modalBackdrop.classList.remove("hidden");
  modalBackdrop.classList.remove("opacity-0");
  modalSignature.classList.remove("hidden");
  (window as unknown as { lucide?: { createIcons: () => void } }).lucide?.createIcons?.();
}

function copySignatureJson() {
  const json = modalSignatureJson?.dataset.json;
  if (json) {
    void navigator.clipboard.writeText(json);
    addStatusMessage("Signature JSON copied to clipboard.");
  }
}

modalBackdrop?.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeModals();
});
document.getElementById("modal-account-close")?.addEventListener("click", closeModals);
document.getElementById("modal-signature-close")?.addEventListener("click", closeModals);
document.getElementById("modal-signature-close-btn")?.addEventListener("click", closeModals);
document.getElementById("modal-x402-image-close")?.addEventListener("click", closeModals);
document.getElementById("modal-x402-json-close")?.addEventListener("click", closeModals);
document.getElementById("modal-x402-json-close-btn")?.addEventListener("click", closeModals);
function copyX402JsonModal() {
  const text = modalX402JsonText?.dataset.copyText;
  if (text) {
    void navigator.clipboard.writeText(text);
    addStatusMessage("Response copied to clipboard.");
  }
}
document.getElementById("modal-x402-json-copy-btn")?.addEventListener("click", copyX402JsonModal);
modalX402JsonContent?.addEventListener("click", copyX402JsonModal);
modalSignatureJson?.addEventListener("click", copySignatureJson);
document.getElementById("modal-signature-copy-btn")?.addEventListener("click", copySignatureJson);
modalAccountAddress?.addEventListener("click", () => {
  const fullAddress = modalAccountAddressText?.dataset.fullAddress;
  if (fullAddress) {
    void navigator.clipboard.writeText(fullAddress);
    addStatusMessage("Address copied to clipboard.");
  }
});

// Get account address button handler
getAccountAddressBtn.addEventListener("click", () => {
  addStatusMessage("Calling getAccountAddress()...");

  // Use cached status.user when available for rich Account Details
  if (cachedStatus?.user) {
    addStatusMessage(`Account: ${cachedStatus.user.username} (${cachedStatus.user.accountAddress})`);
    showAccountModal(cachedStatus.user);
    return;
  }

  // Fallback: fetch address when user not logged in
  oneShotPay.getAccountAddress().match(
    (address) => {
      console.log("Account address:", address);
      addStatusMessage(`Account address: ${address}`);
      showAccountModal(address);
    },
    (err) => {
      addStatusMessage(`getAccountAddress error: ${err.message}`, true);
      console.error("getAccountAddress error:", err);
    },
  );
});

// Toggle frame button handler
toggleFrameBtn.addEventListener("click", () => {
  if (oneShotPay.getVisible()) {
    oneShotPay.hide();
    addStatusMessage("Frame hidden");
  } else {
    oneShotPay.show();
    addStatusMessage("Frame shown");
  }
});

// Show/hide JSON body input when verb is POST or PUT
function updateX402BodyVisibility() {
  const verb = (x402VerbSelect.value || "GET").toUpperCase();
  if (x402BodyRow) {
    x402BodyRow.style.display =
      verb === "POST" || verb === "PUT" ? "block" : "none";
  }
}
x402VerbSelect.addEventListener("change", updateX402BodyVisibility);
updateX402BodyVisibility();

function isValidHttpUrl(str: string): boolean {
  const s = str.trim();
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

function validateX402Url(): boolean {
  const url = (x402UrlInput.value ?? "").trim();
  const valid = !url || isValidHttpUrl(url);
  if (x402UrlError) {
    if (valid) {
      x402UrlError.classList.add("hidden");
      x402UrlInput.classList.remove("border-red-400", "focus:ring-red-400", "focus:border-red-400");
    } else {
      x402UrlError.classList.remove("hidden");
      x402UrlInput.classList.add("border-red-400", "focus:ring-red-400", "focus:border-red-400");
    }
  }
  return valid;
}

x402UrlInput.addEventListener("input", validateX402Url);
x402UrlInput.addEventListener("blur", validateX402Url);

function copyX402ResponseText() {
  const text = x402ResponseText?.dataset.copyText;
  if (text) {
    void navigator.clipboard.writeText(text);
    addStatusMessage("Response copied to clipboard.");
  }
}
x402ResponseTextContainer?.addEventListener("click", copyX402ResponseText);
x402ResponseCopyBtn?.addEventListener("click", copyX402ResponseText);

// x402 request handler
x402RequestBtn.addEventListener("click", () => {
  const url = (x402UrlInput.value || "").trim();
  if (!url) {
    addStatusMessage("Please enter an x402 URL.", true);
    validateX402Url();
    return;
  }
  if (!isValidHttpUrl(url)) {
    addStatusMessage("Please enter a valid URL (e.g. https://...).", true);
    validateX402Url();
    return;
  }

  const method = (x402VerbSelect.value || "GET").toUpperCase() as
    | "GET"
    | "POST"
    | "PUT"
    | "DELETE";

  let init: RequestInit = { method };

  if (method === "POST" || method === "PUT") {
    const rawBody = (x402BodyInput.value || "{}").trim();
    let body: string;
    try {
      const parsed = JSON.parse(rawBody || "{}");
      body = JSON.stringify(parsed);
    } catch {
      addStatusMessage("Invalid JSON in body. Using {} or fix the JSON.", true);
      body = "{}";
    }
    init = { ...init, body, headers: { "Content-Type": "application/json" } };
  }

  x402RequestBtn.disabled = true;
  addStatusMessage(`x402Fetch ${method}: ${url}`);

  oneShotPay.x402Fetch(url, init).match(
    async (res) => {
      const contentType = (res.headers.get("content-type") ?? "").toLowerCase();

      addStatusMessage(
        `x402Fetch response status: ${res.status} ${res.statusText}`,
      );

      const isImage = contentType.includes("image/");

      if (isImage) {
        try {
          const blob = await res.blob();
          const objectUrl = URL.createObjectURL(blob);
          x402ImageObjectUrl = objectUrl;
          if (modalX402ImageContent) {
            modalX402ImageContent.src = objectUrl;
          }
          modalAccount?.classList.add("hidden");
          modalSignature?.classList.add("hidden");
          modalBackdrop?.classList.remove("hidden");
          modalBackdrop?.classList.remove("opacity-0");
          modalX402Image?.classList.remove("hidden");
          (window as unknown as { lucide?: { createIcons: () => void } })
            .lucide?.createIcons?.();
          addStatusMessage(`Response: image (${contentType.split(";")[0]})`);
        } catch (e) {
          addStatusMessage(
            `Failed to read image: ${(e as Error).message}`,
            true,
          );
        }
      } else {
        let body: string;
        try {
          body = await res.text();
        } catch (e) {
          body = `(failed to read body: ${(e as Error).message})`;
        }

        const displayText =
          contentType.includes("application/json") && body
            ? (() => {
                try {
                  return JSON.stringify(JSON.parse(body), null, 2);
                } catch {
                  return body;
                }
              })()
            : body;

        if (modalX402JsonText && modalX402Json) {
          modalX402JsonText.textContent = displayText;
          modalX402JsonText.dataset.copyText = displayText;
          modalAccount?.classList.add("hidden");
          modalSignature?.classList.add("hidden");
          modalX402Image?.classList.add("hidden");
          modalBackdrop?.classList.remove("hidden");
          modalBackdrop?.classList.remove("opacity-0");
          modalX402Json.classList.remove("hidden");
          (window as unknown as { lucide?: { createIcons: () => void } })
            .lucide?.createIcons?.();
        }

        addStatusMessage(
          `Response: ${contentType.includes("application/json") ? "JSON" : "text"}`,
        );
      }

      x402RequestBtn.disabled = false;
    },
    (err) => {
      addStatusMessage(`x402Fetch error: ${err.message}`, true);
      console.error("x402Fetch error:", err);
      x402RequestBtn.disabled = false;
    },
  );
});

// Subscriptions: create subscription (delegation) and log result
subCreateBtn.addEventListener("click", () => {
  const name = (subName.value ?? "").trim();
  const description = (subDescription.value ?? "").trim();
  let destRaw = (subDestinationAddress.value ?? "").trim();
  // Normalize double 0x prefix (e.g. placeholder "0x" + pasted address with "0x")
  if (/^0x0x/i.test(destRaw)) destRaw = "0x" + destRaw.slice(4);
  const amountRaw = subAmount.value?.trim();
  const period = (subPeriod.value ?? "day") as "day" | "week" | "month";

  if (!name) {
    addStatusMessage("Subscriptions: enter a name.", true);
    return;
  }
  if (!destRaw) {
    addStatusMessage("Subscriptions: enter a destination address.", true);
    return;
  }
  const amountNum = amountRaw ? parseInt(amountRaw, 10) : NaN;
  if (!Number.isInteger(amountNum) || amountNum < 1) {
    addStatusMessage("Subscriptions: enter a positive integer amount (USDC smallest units).", true);
    return;
  }

  const amount = USDCAmount(amountNum);
  const amountPerDay = period === "day" ? amount : null;
  const amountPerWeek = period === "week" ? amount : null;
  const amountPerMonth = period === "month" ? amount : null;

  subCreateBtn.disabled = true;
  addStatusMessage(`getSubscription(${name}, ${description || "(no description)"}, ${destRaw}, ${period}=${amountNum})`);

  oneShotPay
    .getSubscription(
      name,
      description,
      EVMAccountAddress(destRaw),
      amountPerDay,
      amountPerWeek,
      amountPerMonth,
    )
    .map((delegation: unknown) => {
      const payload = JSON.stringify(delegation, null, 2);
      addStatusMessage("Subscription created (delegation):");
      addStatusMessage(payload);
      console.log("Created delegation:", delegation);
      subCreateBtn.disabled = false;
    })
    .mapErr((err: ProxyError) => {
      addStatusMessage(`getSubscription error: ${err.message}`, true);
      console.error("getSubscription error:", err);
      subCreateBtn.disabled = false;
    });
});
