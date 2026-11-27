import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/* /download only redirects and the share pages are noindex, so neither belongs
   here. No lastModified: a build-time date would claim every page changed on
   every deploy. */
const PATHS = [
  "",
  "/about",
  "/faq",
  "/contact",
  "/privacy-policy",
  "/terms-of-service",
  "/account-deletion",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({ url: `${SITE_URL}${path}` }));
}
