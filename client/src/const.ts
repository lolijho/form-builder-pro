export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

export const APP_TITLE = import.meta.env.VITE_APP_TITLE || "App";

export const APP_LOGO = "https://placehold.co/128x128/E1E7EF/1F2937?text=App";

// Generate login URL at runtime so redirect URI reflects the backend URL.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  
  // Validate required environment variables
  if (!oauthPortalUrl) {
    console.error("[OAuth] VITE_OAUTH_PORTAL_URL is not configured");
    // Return a fallback URL or throw an error
    throw new Error("OAuth portal URL is not configured. Please set VITE_OAUTH_PORTAL_URL environment variable.");
  }
  
  if (!appId) {
    console.error("[OAuth] VITE_APP_ID is not configured");
    throw new Error("OAuth app ID is not configured. Please set VITE_APP_ID environment variable.");
  }
  
  // Use API URL if available (when frontend and backend are separated),
  // otherwise use current origin (same-origin setup)
  const apiUrl = import.meta.env.VITE_API_URL;
  const redirectUri = apiUrl 
    ? `${apiUrl.replace(/\/$/, "")}/api/oauth/callback`
    : `${window.location.origin}/api/oauth/callback`;
  
  const state = btoa(redirectUri);

  // Ensure oauthPortalUrl is a valid URL string before using it
  const portalUrl = oauthPortalUrl.toString().trim();
  if (!portalUrl) {
    throw new Error("OAuth portal URL is empty");
  }

  const url = new URL(`${portalUrl}/app-auth`);
  url.searchParams.set("appId", appId.toString());
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
