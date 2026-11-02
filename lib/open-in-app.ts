import { PLAY_STORE_URL } from "@/lib/store-links";

/* The production app's own URL scheme and Android package (app.config.ts in
   the app repo). */
const APP_SCHEME = "daur-app";
const ANDROID_PACKAGE = "com.daur.daurapp";

export type PhonePlatform = "android" | "ios";

export function phonePlatform(userAgent: string): PhonePlatform | null {
  if (/android/i.test(userAgent)) return "android";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "ios";
  return null;
}

/* Same rule as parseEntityId in the app: a string the app would refuse must not
   produce a link, because the id comes straight from the URL path. */
function isEntityId(id: string): boolean {
  if (!/^\d+$/.test(id)) return false;
  const n = Number(id);
  return Number.isSafeInteger(n) && n > 0;
}

/* The link behind "Open in Daur", for the times the OS does not open the app by
   itself: in-app browsers, and installs that have not verified the domain yet.

   Android goes through an intent: URL, so a phone without the app lands on the
   Play Store instead of an error page. iOS has no equivalent, so its link can
   only be the plain custom scheme. Returns null for an id the app would refuse. */
export function openInAppHref(
  segment: string,
  id: string,
  platform: PhonePlatform
): string | null {
  if (!isEntityId(id)) return null;

  const path = `${segment}/${id}`;
  if (platform === "ios") return `${APP_SCHEME}://${path}`;

  const fallback = encodeURIComponent(PLAY_STORE_URL);
  return `intent://${path}#Intent;scheme=${APP_SCHEME};package=${ANDROID_PACKAGE};S.browser_fallback_url=${fallback};end`;
}
