export * from "./generated/api";
export * from "./generated/api.schemas";
export { setBaseUrl, setAuthTokenGetter } from "./custom-fetch";
export type { AuthTokenGetter } from "./custom-fetch";

/** Explicit re-export — évite les erreurs de résolution Vite en monorepo */
export {
  useGetCvPayment,
  getCvPayment,
  getGetCvPaymentQueryKey,
  useInitializePaystackPayment,
  useVerifyPaystackPayment,
  initializePaystackPayment,
  verifyPaystackPayment,
} from "./generated/api";
