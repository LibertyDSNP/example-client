export const ENVIRONMENT = process.env.NODE_ENV;
export const isProd = ENVIRONMENT === "production"; // Anything else is treated as 'dev'
export const isTest = ENVIRONMENT === "test";

export const WEBSOCKET_HOST = process.env.WEBSOCKET_HOST;
export const CONTRACT_HOST = process.env.CONTRACT_HOST;
export const CHAIN_ID = process.env.CHAIN_ID;
// Remove trailing slash if any
export const EXTERNAL_HOST_URL = process.env.EXTERNAL_HOST_URL
  ? process.env.EXTERNAL_HOST_URL.replace(/\/$/, "")
  : null;

if (!EXTERNAL_HOST_URL) {
  throw new Error("Missing EXTERNAL_HOST_URL environment variable!");
}
export const NAMESPACE =
  (EXTERNAL_HOST_URL.includes("//dev-") && "dev") ||
  (EXTERNAL_HOST_URL.includes("//qa-") && "qa") ||
  "local";

if (!WEBSOCKET_HOST) {
  throw new Error("Missing WEBSOCKET_HOST environment variable!");
}

if (!CONTRACT_HOST) {
  throw new Error("Missing CONTRACT_HOST environment variable!");
}

if (!CHAIN_ID) {
  throw new Error("Missing CHAIN_ID environment variable!");
}
