let scriptPromise: Promise<void> | null = null;

export function loadPaystackScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.PaystackPop) return Promise.resolve();

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
      if (existing) {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("Paystack script failed")));
        return;
      }

      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Impossible de charger Paystack"));
      document.body.appendChild(script);
    });
  }

  return scriptPromise;
}

export type PaystackCallbackResponse = {
  reference: string;
  trans?: string;
  status?: string;
};

export type OpenPaystackOptions = {
  publicKey: string;
  email: string;
  amount: number;
  currency: string;
  reference: string;
  accessCode?: string;
  onSuccess: (response: PaystackCallbackResponse) => void;
  onClose?: () => void;
};

export async function openPaystackCheckout(options: OpenPaystackOptions) {
  await loadPaystackScript();

  if (!window.PaystackPop) {
    throw new Error("Paystack indisponible");
  }

  const handler = window.PaystackPop.setup(
    options.accessCode
      ? {
          key: options.publicKey,
          access_code: options.accessCode,
          callback: (response: PaystackCallbackResponse) => options.onSuccess(response),
          onClose: () => options.onClose?.(),
        }
      : {
          key: options.publicKey,
          email: options.email,
          amount: options.amount,
          currency: options.currency,
          ref: options.reference,
          callback: (response: PaystackCallbackResponse) => options.onSuccess(response),
          onClose: () => options.onClose?.(),
        },
  );

  handler.openIframe();
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: Record<string, unknown>) => { openIframe: () => void };
    };
  }
}
