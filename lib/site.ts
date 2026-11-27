import { PLAY_STORE_URL } from "@/lib/store-links";

/** The canonical origin. www and the vercel.app alias also serve the site, so
    anything crawlers see (metadataBase, sitemap, JSON-LD) must use this one. */
export const SITE_URL = "https://daurapp.com";

export const SITE_NAME = "Daur";

export const SITE_TITLE = "Daur — Turn every run into a territory war";

/* Names "Daur" up front and carries the generic terms ("running app",
   "territory") people search with, since the homepage hero has little text. */
export const SITE_DESCRIPTION =
  "Daur is a running app that turns every walk and run into a territory war. Claim hex zones on a real map, complete daily quests and compete with friends.";

/* Official profiles. Listed as Organization.sameAs so Google ties them to the
   brand, and linked from the footer with rel="me". */
export const SOCIAL_LINKS = [
  { name: "Instagram", url: "https://www.instagram.com/daurapp/" },
  { name: "X", url: "https://x.com/daurapp" },
  { name: "LinkedIn", url: "https://www.linkedin.com/company/daurapp" },
  { name: "YouTube", url: "https://www.youtube.com/@daurapp" },
] as const;

/* The TestFlight link is left out: it is not a stable profile of the brand.
   Add the App Store listing here once iOS ships publicly. */
export const SAME_AS = [...SOCIAL_LINKS.map((s) => s.url), PLAY_STORE_URL];

/** Serialises JSON-LD for a <script> tag; escaping `<` keeps a stray
    "</script>" in any string from closing the tag early. */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
